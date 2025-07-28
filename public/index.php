<?php

use App\Kernel;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    // Manually set the environment to 'prod' and disable debug mode
    $_SERVER['APP_ENV'] = $context['APP_ENV'] = 'prod';
    $_SERVER['APP_DEBUG'] = $context['APP_DEBUG'] = false;

    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
