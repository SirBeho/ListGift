<?php

use Dotenv\Dotenv;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require './vendor/autoload.php';

require './src/Config/ENV.php';

/* $dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dotenv = Dotenv::createMutable(__DIR__, '.env.local');
$dotenv->safeLoad(); */

require 'src/routes/index.php';
