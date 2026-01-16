<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserManagementController;


Route::get('/', function () {
    return view('welcome');
});

// Admin login
Route::get('/admin/login', function () {
    return view('admin.login');
})->name('admin.login');

Route::post('/admin/login', function () {
    $credentials = request()->validate([
        'login' => 'required|string',
        'password' => 'required|string',
    ]);

    $user = \App\Models\User::where('username', $credentials['login'])
        ->orWhere('email', $credentials['login'])
        ->first();

    if (!$user || !password_verify($credentials['password'], $user->password)) {
        return back()->with('error', 'Invalid credentials');
    }

    if ($user->role !== 'admin') {
        return back()->with('error', 'Admin access required');
    }

    Auth::login($user);
    request()->session()->regenerate();

    return redirect()->route('admin.users.index');
})->name('admin.login.submit');

// Admin routes
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
    Route::get('/users/{id}/edit', [UserManagementController::class, 'edit'])->name('users.edit');
    Route::put('/users/{id}', [UserManagementController::class, 'update'])->name('users.update');
    Route::patch('/users/{id}/toggle', [UserManagementController::class, 'toggleActive'])->name('users.toggle');
    Route::delete('/users/{id}', [UserManagementController::class, 'destroy'])->name('users.destroy');
});

Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/admin/login');
})->name('logout');
