<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$preferredPhpBinary = getenv('BUSTERTERMINAL_PHP_BINARY') ?: '/opt/homebrew/opt/php@8.3/bin/php';

if (! extension_loaded('intl')) {
    http_response_code(500);
    header('Content-Type: text/html; charset=utf-8');

    $message = sprintf(
        'This project must run with a PHP build that has the intl extension enabled. Current PHP: %s. Start the backend with: %s artisan serve --host=127.0.0.1 --port=8000',
        PHP_VERSION,
        $preferredPhpBinary
    );

    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>PHP intl extension required</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:32px}main{max-width:860px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px}code{display:block;white-space:pre-wrap;word-break:break-word;background:#0f172a;color:#f8fafc;padding:14px 16px;border-radius:12px;margin-top:16px}</style></head><body><main><h1>PHP intl extension required</h1><p>The running PHP binary does not have the <strong>intl</strong> extension enabled, so the admin panel cannot render reliably.</p><code>'
        . htmlspecialchars($message, ENT_QUOTES, 'UTF-8')
        . '</code></main></body></html>';

    exit(1);
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once __DIR__.'/../bootstrap/app.php')
    ->handleRequest(Request::capture());
