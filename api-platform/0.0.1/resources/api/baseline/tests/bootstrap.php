<?php

use Symfony\Component\Dotenv\Dotenv;

require dirname(__DIR__).'/vendor/autoload.php';

// This file is PHPUnit-only. Force test env before Dotenv: Docker/CLI may set APP_ENV=dev,
// and bootEnv loads .env which would overwrite APP_ENV unless $_ENV['APP_ENV'] is already set.
$_SERVER['APP_ENV'] = $_ENV['APP_ENV'] = 'test';
putenv('APP_ENV=test');

if (method_exists(Dotenv::class, 'bootEnv')) {
    (new Dotenv())->bootEnv(dirname(__DIR__).'/.env');
}

if ($_SERVER['APP_DEBUG']) {
    umask(0000);
}
