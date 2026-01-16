<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

use App\Models\Role;
use App\Models\User;
use App\Models\Client;
use App\Models\Vehicle;
use App\Models\Service;
use App\Models\Appointment;
use App\Models\RepairOrder;

class DatabaseSeeder extends Seeder
{

    public function run(): void
    {
        // Roles (avoid duplicates)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole  = Role::firstOrCreate(['name' => 'user']);

        // Admin user 
        User::firstOrCreate(
            ['email' => 'admin@workshop.com'],
            [
                'name' => 'Admin',
                'username' => 'admin',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'active' => true,
            ]
        );

        // Services 
        $services = [
            ['name' => 'Oil Change', 'price' => 45.00, 'duration_minutes' => 30],
            ['name' => 'Full Inspection', 'price' => 150.00, 'duration_minutes' => 120],
            ['name' => 'Tire Replacement', 'price' => 200.00, 'duration_minutes' => 60],
            ['name' => 'Brake Repair', 'price' => 180.00, 'duration_minutes' => 90],
            ['name' => 'Electronic Diagnosis', 'price' => 60.00, 'duration_minutes' => 45],
            ['name' => 'Wheel Alignment', 'price' => 50.00, 'duration_minutes' => 30],
            ['name' => 'Battery Replacement', 'price' => 120.00, 'duration_minutes' => 30],
            ['name' => 'MOT Test', 'price' => 40.00, 'duration_minutes' => 60],
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(['name' => $service['name']], $service);
        }

        //Create users (role=user) 
        $users = User::factory(10)->create([
            'role_id' => $userRole->id,
            'active' => true,
        ]);

        foreach ($users as $u) {
            Client::factory()->create(['user_id' => $u->id]);
        }

        // Vehicles 
        Vehicle::factory(15)->create();

        // Appointments 
        Appointment::factory(20)->create();

        // Repair orders 
        RepairOrder::factory(12)->create();
    }
}
