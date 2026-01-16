<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    // Check if current user is admin
    private function isAdmin(Request $request): bool
    {
        return $request->user()?->role === 'admin';
    }

    // Get client_id of the authenticated user (if any)
    private function currentClientId(Request $request): ?int
    {
        return $request->user()?->client?->id;
    }

    public function index(Request $request)
    {
        // List clients (admin ONLY)
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden. Only administrators can list clients.'], 403);
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        return response()->json(
            Client::with(['user', 'vehicles'])->orderBy('id', 'desc')->paginate($perPage)
        );
    }

    public function store(Request $request)
    {
        // Create client (admin only)
        // Only admin can create clients manually (users get client via register)
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'user_id' => ['nullable', 'exists:users,id', 'unique:clients,user_id'],
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $client = Client::create($data);

        return response()->json($client->load('user', 'vehicles'), 201);
    }

    public function show(Request $request, string $id)
    {
        // Show client (admin: any, user: own)
        // Admin: can view any client
        if ($this->isAdmin($request)) {
            return response()->json(
                Client::with(['user', 'vehicles'])->findOrFail($id)
            );
        }

        // User: only own
        $clientId = $this->currentClientId($request);
        if (!$clientId || (int)$id !== (int)$clientId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(
            Client::with(['user', 'vehicles'])->findOrFail($clientId)
        );
    }

    public function update(Request $request, string $id)
    {
        // Update client (admin: any, user: own)
        // Admin: update any
        if ($this->isAdmin($request)) {
            $client = Client::findOrFail($id);

            $data = $request->validate([
                'full_name' => ['sometimes', 'string', 'max:255'],
                'phone' => ['sometimes', 'string', 'max:20'],
                'email' => ['sometimes', 'email', 'max:255'],
                'address' => ['nullable', 'string', 'max:255'],
            ]);

            $client->update($data);
            return response()->json($client->load('user', 'vehicles'));
        }

        // User: only own
        $clientId = $this->currentClientId($request);
        if (!$clientId || (int)$id !== (int)$clientId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $client = Client::findOrFail($clientId);

        $data = $request->validate([
            'full_name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'email' => ['sometimes', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $client->update($data);

        return response()->json($client->load('user', 'vehicles'));
    }

    public function destroy(Request $request, string $id)
    {
        // Delete client (admin only)
        // Only admin can delete clients
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json(['message' => 'Client deleted successfully']);
    }
}
