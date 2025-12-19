<?php

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__, '../../.env');
$dotenv->safeLoad();

$dotenv = Dotenv::createMutable(__DIR__, '../../.env.local');
$dotenv->safeLoad();
