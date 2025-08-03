<?php

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    // Set environment to production
    $_SERVER['APP_ENV'] = $context['APP_ENV'] = 'prod';
    $_SERVER['APP_DEBUG'] = $context['APP_DEBUG'] = false;

    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};