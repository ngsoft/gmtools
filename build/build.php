<?php

use NGSOFT\Tools\Objects\stdObject;
use function NGSOFT\Tools\array_flatten;

require_once __DIR__ . '/vendor/autoload.php';

function mapFn($dir, $root) {

    if (is_string($dir)) return $root . $dir . '/';
    if ($dir instanceof stdObject) {
        $dir = $dir->map(fn($ndir) => $root . $ndir . '/');
    }
    return $dir;
}

if (file_exists(__DIR__ . '/build.json')) {

    $build = stdObject::fromJsonFile(__DIR__ . '/build.json');
    $root = dirname(__DIR__);

    foreach ($build as $key => $dir) {

        $build = $build->map(function ($dir)use($root) {
            return mapFn($dir, $root);
        });
    }
}