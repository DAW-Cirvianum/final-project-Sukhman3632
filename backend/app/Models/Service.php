<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'duration_minutes'];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
