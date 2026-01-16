<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RepairOrder;
use Illuminate\Http\Request;

class RepairOrderController extends Controller
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

    public function index(Request $request)
    {
        if ($resp = $this->denyIfNotAdmin($request)) return $resp;

        $query = RepairOrder::with(['vehicle.client', 'appointment', 'services']);

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        return response()->json($query->orderBy('id', 'desc')->paginate($perPage));
    }

    public function store(Request $request)
    {
        if ($resp = $this->denyIfNotAdmin($request)) return $resp;

        $data = $request->validate([
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'description' => ['required', 'string'],
            'status' => ['required', 'in:open,closed'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'final_cost' => ['required', 'numeric', 'min:0'],
        ]);

        $repairOrder = RepairOrder::create($data);

        // Attach services if provided
        if ($request->has('service_ids') && is_array($request->service_ids)) {
            $repairOrder->services()->sync($request->service_ids);
        }

        return response()->json($repairOrder->load(['vehicle', 'appointment', 'services']), 201);
    }

    public function show(Request $request, string $id)
    {
        if ($resp = $this->denyIfNotAdmin($request)) return $resp;

        return response()->json(
            RepairOrder::with(['vehicle', 'appointment'])->findOrFail($id)
        );
    }

    public function update(Request $request, string $id)
    {
        if ($resp = $this->denyIfNotAdmin($request)) return $resp;

        $repairOrder = RepairOrder::findOrFail($id);

        $data = $request->validate([
            'description' => ['sometimes', 'string'],
            'status' => ['sometimes', 'in:open,closed'],
            'start_date' => ['sometimes', 'nullable', 'date'],
            'end_date' => ['sometimes', 'nullable', 'date', 'after_or_equal:start_date'],
            'final_cost' => ['sometimes', 'numeric', 'min:0'],
        ]);

        $repairOrder->update($data);

        // Update services if provided
        if ($request->has('service_ids') && is_array($request->service_ids)) {
            $repairOrder->services()->sync($request->service_ids);
        }

        return response()->json($repairOrder->load(['vehicle', 'appointment', 'services']));
    }

    public function destroy(Request $request, string $id)
    {
        if ($resp = $this->denyIfNotAdmin($request)) return $resp;

        $repairOrder = RepairOrder::findOrFail($id);
        $repairOrder->delete();

        return response()->json(['message' => 'Repair order deleted successfully']);
    }
}
