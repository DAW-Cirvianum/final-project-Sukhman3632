<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    private function isAdmin(Request $request): bool
    {
        return $request->user()?->role === 'admin';
    }

    private function denyIfNotAdmin(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return null;
    }

    /**
     * Display a listing of the users (Admin only).
     */
    public function index(Request $request)
    {
        if ($resp = $this->denyIfNotAdmin($request)) return $resp;

        $users = User::with('role', 'client')->get();
        return response()->json($users);
    }

    /**
     * Store a newly created user (Admin only).
     */
    public function store(Request $request)
    {
        if ($resp = $this->denyIfNotAdmin($request)) return $resp;

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['required', 'exists:roles,id'],
            'active' => ['required', 'boolean'],
        ]);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        return response()->json($user->load('role', 'client'), 201);
    }

    /**
     * Display the specified user (Admin only).
     */
    public function show(Request $request, string $id)
    {
        if ($resp = $this->denyIfNotAdmin($request)) return $resp;

        $user = User::with('role', 'client')->findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified user (Admin only).
     */
    public function update(Request $request, string $id)
    {
        if ($resp = $this->denyIfNotAdmin($request)) return $resp;

        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'username' => ['sometimes', 'string', 'max:255', 'unique:users,username,' . $id],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $id],
            'password' => ['sometimes', 'string', 'min:8'],
            'role_id' => ['sometimes', 'exists:roles,id'],
            'active' => ['sometimes', 'boolean'],
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json($user->load('role', 'client'));
    }

    /**
     * Remove the specified user (Admin only).
     */
    public function destroy(Request $request, string $id)
    {
        if ($resp = $this->denyIfNotAdmin($request)) return $resp;

        $user = User::findOrFail($id);

        // Prevent deleting yourself
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete yourself'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
