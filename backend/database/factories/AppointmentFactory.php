<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Client;
use App\Models\Vehicle;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'client_id' => Client::inRandomOrder()->first()->id,
            'vehicle_id' => Vehicle::inRandomOrder()->first()->id,
            'service_id' => Service::inRandomOrder()->first()->id,
            'date_time' => fake()->dateTimeBetween('now', '+3 months'),
            'status' => fake()->randomElement(['pending', 'accepted', 'cancelled']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
