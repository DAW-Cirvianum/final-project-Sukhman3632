<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
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
        // List appointments (user: own, admin: all + filters)
        $query = Appointment::with(['client', 'vehicle', 'service']);

        if (!$this->isAdmin($request)) {
            $clientId = $this->currentClientId($request);
            if (!$clientId) {
                return response()->json(['message' => 'Client profile not found.'], 404);
            }
            $query->where('client_id', $clientId);
        } else {
            if ($request->filled('client_id')) {
                $query->where('client_id', $request->client_id);
            }
        }

        // Filter: appointments between two dates
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date_time', [$request->start_date, $request->end_date]);
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
        // Admin can create for any client, user creates for themselves
        if ($this->isAdmin($request)) {
            // Admin must specify client_id
            $data = $request->validate([
                'client_id' => ['required', 'exists:clients,id'],
                'vehicle_id' => ['required', 'exists:vehicles,id'],
                'service_id' => ['nullable', 'exists:services,id'],
                'date_time' => ['required', 'date'],
                'notes' => ['nullable', 'string'],
                'status' => ['nullable', 'in:pending,accepted,cancelled'],
            ]);
            
            $clientId = $data['client_id'];
            $status = $data['status'] ?? 'pending';
        } else {
            // User creates for their own client profile
            $clientId = $this->currentClientId($request);
            if (!$clientId) {
                return response()->json(['message' => 'Client profile not found.'], 404);
            }

            $data = $request->validate([
                'vehicle_id' => [
                    'required',
                    Rule::exists('vehicles', 'id')->where(fn ($q) => $q->where('client_id', $clientId)),
                ],
                'service_id' => ['nullable', 'exists:services,id'],
                'date_time' => ['required', 'date'],
                'notes' => ['nullable', 'string'],
            ]);
            
            $status = 'pending';
        }

        $appointment = Appointment::create([
            'client_id' => $clientId,
            'vehicle_id' => $data['vehicle_id'],
            'service_id' => $data['service_id'] ?? null,
            'date_time' => $data['date_time'],
            'status' => $status,
            'notes' => $data['notes'] ?? null,
        ]);

        return response()->json($appointment->load(['client', 'vehicle', 'service']), 201);
    }

    public function show(Request $request, string $id)
    {
        // Show appointment (admin: any, user: own)
        $appointment = Appointment::with(['client', 'vehicle', 'service', 'repairOrder'])->findOrFail($id);

        if (!$this->isAdmin($request)) {
            $clientId = $this->currentClientId($request);
            if (!$clientId || $appointment->client_id !== $clientId) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        return response()->json($appointment);
    }

    public function update(Request $request, string $id)
    {
        // Update appointment (admin ONLY, user cannot update/cancel)
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden. Only administrators can update appointments.'], 403);
        }

        $appointment = Appointment::findOrFail($id);

        $rules = [
            'date_time' => ['sometimes', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:pending,accepted,cancelled'],
        ];
        $data = $request->validate($rules);

        $appointment->update($data);

        return response()->json($appointment->load(['client', 'vehicle', 'service']));
    }

    public function destroy(Request $request, string $id)
    {
        // Delete appointment (admin ONLY)
        if (!$this->isAdmin($request)) {
            return response()->json(['message' => 'Forbidden. Only administrators can delete appointments.'], 403);
        }

        $appointment = Appointment::findOrFail($id);

        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted successfully']);
    }
}
