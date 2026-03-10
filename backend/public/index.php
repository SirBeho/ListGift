<?php

use Dotenv\Dotenv;


ob_implicit_flush(true);
while (ob_get_level() > 0) ob_end_flush();


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

error_reporting(E_ALL);

require  __DIR__ .'../vendor/autoload.php';

/* $dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dotenv = Dotenv::createMutable(__DIR__, '.env.local');S
$dotenv->safeLoad(); */

require '../src/Config/ENV.PHP';
require '../src/routes/index.php';
