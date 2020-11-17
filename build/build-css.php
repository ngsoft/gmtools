<?php

require_once __DIR__ . '/build.php';

define('regexComments', '/\/\*(?:.*?\v*)+\*\//m');
define('regexImport', '/@import\h+url\((.+)\);/m');
define('regexIsURL', '/^(?:https?:)?[\/]{2}/');


$inputFile = $build->sources->css . "all.css";
$outputFile = $build->destination . time() . "/%s.css";

function normalizeCSS(string $text) {
    $text = preg_replace(regexComments, '', $text);
    $lines = preg_split('/\v+/', $text);
    $normalized = "";
    foreach ($lines as $line) $normalized .= trim($line);
    return $normalized;
}

function parseFile($filename) {
    $contents = "";

    if (file_exists($filename)) {
        $dir = dirname($filename) . '/';

        if ($contents = file_get_contents($filename)) {

            $contents = preg_replace(regexComments, '', $contents);
            $contents = preg_replace_callback(regexImport, function($matches)use($dir) {
                list(, $url) = $matches;
                $url = preg_replace('/[\'\"]+/', '', $url);
                if (!preg_match(regexIsURL, $url)) {
                    printf("@import %s\n", $url);
                    $url = $dir . $url;
                    return sprintf("%s\n", trim(parseFile($url)));
                }
                return $matches[0];
            }, $contents);
        }
    } else printf("Warning: cannot import: %s", $filename);
    return $contents;
}

if ($css = parseFile($inputFile)) {
    $css = trim($css);
    $name = pathinfo($inputFile, PATHINFO_FILENAME);
    $output = sprintf($outputFile, $name);

    if (!is_dir(dirname($output))) mkdir(dirname($output), 0777, true);
    file_put_contents($output, $css);
    print "Build complete.\n";
}

