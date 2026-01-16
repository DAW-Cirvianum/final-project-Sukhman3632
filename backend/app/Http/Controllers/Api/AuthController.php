<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => 2, // default user
            'active' => true,
        ]);

        // Create client profile (1-1 with user)
        Client::create([
            'user_id' => $user->id,
            'full_name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'],
            'address' => $data['address'] ?? null,
        ]);

        // Load role to decide token ability
        $user->load('role_relation');

        $roleName = $user->role_relation?->name ?? 'user';
        $abilities = [$roleName === 'admin' ? 'admin' : 'user'];

        // Optional: remove previous tokens (cleaner)
        $user->tokens()->delete();

        $token = $user->createToken('auth_token', $abilities)->plainTextToken;

        // Send email verification
        $user->sendEmailVerificationNotification();

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'ability' => $abilities[0],
            'user' => $user->load('role_relation', 'client'),
            'message' => 'Registration successful. Please verify your email.',
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['login'])
            ->orWhere('username', $data['login'])
            ->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->active) {
            return response()->json(['message' => 'Account is disabled.'], 403);
        }

        // Load role to decide token ability
        $user->load('role_relation');

        $roleName = $user->role_relation?->name ?? 'user';
        $abilities = [$roleName === 'admin' ? 'admin' : 'user'];

        // Optional: remove previous tokens (cleaner)
        $user->tokens()->delete();

        $token = $user->createToken('auth_token', $abilities)->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'ability' => $abilities[0],
            'user' => $user->load('role_relation', 'client'),
        ]);
    }

    
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }

    
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('role_relation', 'client'),
        ]);
    }
}
