<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Oil Change', 'Full Inspection', 'Tire Replacement', 'Brake Repair', 'Electronic Diagnosis', 'Wheel Alignment', 'Battery Replacement', 'Filter Replacement', 'MOT Test', 'Air Conditioning']),
            'price' => fake()->randomFloat(2, 30, 500),
            'duration_minutes' => fake()->randomElement([30, 60, 90, 120, 180, 240]),
        ];
    }
}
