<?php

use NGSOFT\Tools\Objects\stdObject;
use function NGSOFT\Tools\array_flatten;

require_once __DIR__ . '/build.php';


define('regexComments', '/\/\*(?:.*?\v*)+\*\//m');

define('regexVars', '/[\-]{2}([\w-]+):\s+(.*)\;/');
define('regexSpacing', '/[\-]{2}(spacing\-(\d+)):\s+(.*)\;/');
define('regexColor', '/^(?:bg\-)?(\w+)/');
define('regexReplaceCSS', '/\$(\w+)/');


$inputFile = $build->sources->css . "variables.css";
$inputTemplates = $build->templates . 'colors/';

$outputFile = $build->destination . time() . "/%s.css";

$templates = [];
$variables = stdObject::create();
$variants = stdObject::create();

$input = file_get_contents($inputFile);

$inputVariants = stdObject::from([
            "light" => [
                "continue" => false,
                "matches" => "/\-light$/",
            ],
            "dark" => [
                "continue" => false,
                "matches" => "/\-dark$/",
            ],
            "color" => [
                "continue" => false,
                "matches" => "/^(\w+)/",
            ],
        ]);

$ignoreVars = [
    '/\-(darker|lighter|bis|ter)$/',
    // '/^spacing\-/',
    '/^(light|dark|gray)\-/',
];


//read input file
$input = preg_replace(regexComments, '', $input);

$input = preg_replace_callback(regexSpacing, function($matches)use($variables) {
    list(, $varName, $size) = $matches;
    if (!isset($variables[$size])) $variables[$size] = [];
    $variables[$size]["spacing"] = $varName;
    return '';
}, $input);

preg_replace_callback(regexVars, function($matches) use($variables, $inputVariants, $ignoreVars) {

    list($orig, $varname) = $matches;
    if (preg_match(regexColor, $varname, $matches)) {
        list(, $color) = $matches;
        $continue = false;

        foreach ($ignoreVars as $regex) {
            if (preg_match($regex, $varname)) {
                $continue = true;
                break;
            }
        }


        if ($continue === true) return $orig;
        foreach ($inputVariants as $name => $variant) {

            if (preg_match($variant->matches, $varname)) {

                if (!isset($variables[$color])) $variables[$color] = [];
                //if (!isset($variables[$color][$name])) $variables[$color][$name] = [];
                $variables[$color][$name] = $varname;

                if ($variant->continue === false) break;
            }
        }
    }

    return $orig;
}, $input);



//loads templates
if (is_dir($inputTemplates)) {
    foreach (scandir($inputTemplates) as $file) {
        if (preg_match('/\.json$/', $file)) {
            $path = $inputTemplates . $file;
            $template = stdObject::fromJsonFile($path);
            $template->style = file_get_contents($inputTemplates . $template->style);
            $templates[] = $template;
        }
    }
}

//print_r($templates);
usort($templates, function ($a, $b) {

    $posA = isset($a['pos']) ? $a['pos'] : 1500;
    $posB = isset($b['pos']) ? $b['pos'] : 1501;
//    print_r([$posA, $posB]);
    return $posA < $posB ? -1 : 1;
});


//print_r($variables->toArray());
//exit;
//build css
foreach ($templates as $template) {

    $result = [];
    $tincludes = $template->includes;


    foreach ($variables as $color => $entry) {

        if (!$tincludes->every(fn($v) => isset($entry[$v]))) continue;

        $style = preg_replace_callback(regexReplaceCSS, function($matches)use($entry, $color) {
            list($orig, $key) = $matches;
            if ($key === 'class') return $color;
            if (isset($entry[$key])) return sprintf('var(--%s)', $entry[$key]);
            printf("Warning: cannot match %s.\n", $orig);
            return $orig;
        }, $template->style);
        if ($style !== $template->style) {


            $css = trim($style);
            $result[] = $css;
        }
    }


    if (count($result)) {
        $output = sprintf($outputFile, $template->name);

        if (!is_dir(dirname($output))) mkdir(dirname($output), 0777, true);
        file_put_contents($output, implode("\n", $result));
    }
}
