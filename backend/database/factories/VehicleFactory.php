<?php

namespace Database\Factories;

use App\Models\Vehicle;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    public function definition(): array
    {
        return [
            'client_id' => Client::inRandomOrder()->first()->id,
            'brand' => fake()->randomElement([
                'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes',
                'Audi', 'Volkswagen', 'Seat', 'Renault', 'Peugeot'
            ]),
            'model' => fake()->randomElement([
                'Corolla', 'Civic', 'Focus', 'Series 3', 'A-Class',
                'A4', 'Golf', 'Ibiza', 'Clio', '208'
            ]),
            'plate' => strtoupper(fake()->bothify('####???')),
            'year' => fake()->numberBetween(1990, 2024),
            'km_current' => fake()->numberBetween(5_000, 300_000),
        ];
    }
}
