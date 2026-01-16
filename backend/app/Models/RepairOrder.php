<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RepairOrder extends Model
{
    use HasFactory;

    protected $fillable = ['vehicle_id', 'appointment_id', 'description', 'status', 'start_date', 'end_date', 'final_cost'];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'repair_order_service');
    }
}
