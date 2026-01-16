<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\RepairOrderController;
use App\Http\Controllers\Api\UserController;

// Public routes (no auth)

// Public services (read-only)
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

// Auth routes (/auth/*)
Route::prefix('auth')->group(function () {
    // Public: register + login
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected: requires Bearer token (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Protected routes (auth required)
Route::middleware('auth:sanctum')->group(function () {

    // User resources (controllers enforce ownership for "user" role)
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('appointments', AppointmentController::class);
    Route::apiResource('repair-orders', RepairOrderController::class);

    // Admin only routes
    Route::middleware('role:admin')->group(function () {

        // Services write operations (admin-only)
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{id}', [ServiceController::class, 'update']);
        Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

        // Users management (admin-only)
        Route::apiResource('users', UserController::class);
    });
});

