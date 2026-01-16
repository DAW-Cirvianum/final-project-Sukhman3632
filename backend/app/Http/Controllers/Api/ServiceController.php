<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // Check if current user is admin
    private function isAdmin(Request $request): bool
    {
        return $request->user()?->role === 'admin';
    }

    public function index()
    {
        // List all services
        return response()->json(Service::orderBy('id', 'desc')->get());
    }

    public function show(string $id)
    {
        // Show one service
        return response()->json(Service::findOrFail($id));
    }

    public function store(Request $request)
    {
        // Create service (admin only)
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
        ]);

        $service = Service::create($data);

        return response()->json($service, 201);
    }

    public function update(Request $request, string $id)
    {
        // Update service (admin only)
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $service = Service::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'duration_minutes' => ['sometimes', 'integer', 'min:1'],
        ]);

        $service->update($data);

        return response()->json($service);
    }

    public function destroy(Request $request, string $id)
    {
        // Delete service (admin only)
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service deleted successfully']);
    }
}
