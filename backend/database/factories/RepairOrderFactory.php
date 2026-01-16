<?php

namespace Database\Factories;

use App\Models\RepairOrder;
use App\Models\Vehicle;
use App\Models\Appointment;
use Illuminate\Database\Eloquent\Factories\Factory;

class RepairOrderFactory extends Factory
{
    protected $model = RepairOrder::class;

    public function definition(): array
    {
        return [
            'vehicle_id' => Vehicle::inRandomOrder()->first()->id,
            'appointment_id' => fake()->optional()->randomElement(
                Appointment::pluck('id')->toArray()
            ),
            'description' => fake()->randomElement([
                'Engine oil and filter replacement. Check all fluid levels.',
                'Brake pads and discs replacement on front axle. Test drive completed.',
                'Full diagnostic scan. Replace spark plugs and air filter.',
                'Tire rotation and balancing. Check wheel alignment.',
                'Replace battery and check alternator output. Clean terminals.',
                'Transmission fluid change. Inspect gearbox for leaks.',
                'Replace timing belt and water pump. Check tensioners.',
                'Air conditioning system recharge. Replace cabin filter.',
                'Suspension inspection. Replace front shock absorbers.',
                'Complete vehicle inspection. Replace windshield wipers.',
            ]),
            'status' => fake()->randomElement(['open', 'closed']),
            'start_date' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'end_date' => fake()->optional()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'final_cost' => fake()->randomFloat(2, 50, 2000),
        ];
    }
}
