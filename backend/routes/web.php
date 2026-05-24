<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'Clothing E-commerce API',
        'version' => '1.0.0',
        'documentation' => '/api/v1',
    ]);
});
