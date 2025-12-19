<?php

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__, '../../.env');
$dotenv->load();

$dotenv = Dotenv::createMutable(__DIR__, '../../.env.local');
$dotenv->safeLoad();
