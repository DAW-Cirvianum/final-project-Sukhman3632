<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
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

    // List vehicles (admin: all, user: own)
    public function index(Request $request)
    {
        $query = Vehicle::with('client')->orderBy('id', 'desc');

        if ($this->isAdmin($request)) {
            if ($request->filled('client_id')) {
                $query->where('client_id', $request->client_id);
            }
        } else {
            $clientId = $this->currentClientId($request);
            if (!$clientId) {
                return response()->json(['message' => 'Client profile not found for this user'], 403);
            }
            $query->where('client_id', $clientId);
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        return response()->json($query->paginate($perPage));
    }

    // Create vehicle (admin ONLY)
    public function store(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden. Only administrators can create vehicles.'], 403);
        }

        $rules = [
            'client_id' => ['required', 'exists:clients,id'],
            'brand' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'plate' => ['required', 'string', 'max:20', 'unique:vehicles,plate'],
            'year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'km_current' => ['required', 'integer', 'min:0'],
        ];

        $data = $request->validate($rules);

        $vehicle = Vehicle::create($data);

        return response()->json($vehicle->load('client'), 201);
    }

    // Show vehicle (admin: any, user: own)
    public function show(Request $request, string $id)
    {
        $vehicle = Vehicle::with('client', 'appointments', 'repairOrders')->findOrFail($id);

        if (!$this->isAdmin($request)) {
            $clientId = $this->currentClientId($request);
            if (!$clientId || $vehicle->client_id !== $clientId) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        return response()->json($vehicle);
    }

    // Update vehicle (admin ONLY)
    public function update(Request $request, string $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden. Only administrators can update vehicles.'], 403);
        }

        $vehicle = Vehicle::findOrFail($id);

        $data = $request->validate([
            'client_id' => ['sometimes', 'exists:clients,id'],
            'brand' => ['sometimes', 'string', 'max:255'],
            'model' => ['sometimes', 'string', 'max:255'],
            'plate' => ['sometimes', 'string', 'max:20', 'unique:vehicles,plate,' . $id],
            'year' => ['sometimes', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'km_current' => ['sometimes', 'integer', 'min:0'],
        ]);

        $vehicle->update($data);

        return response()->json($vehicle->load('client'));
    }

    // Delete vehicle (admin ONLY)
    public function destroy(Request $request, string $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden. Only administrators can delete vehicles.'], 403);
        }

        $vehicle = Vehicle::findOrFail($id);

        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully']);
    }
}
