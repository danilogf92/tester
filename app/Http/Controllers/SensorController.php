<?php

namespace App\Http\Controllers;

use App\Events\ParkingAcceptedUser;
use App\Events\ParkingStatusUpdated;
use App\Http\Resources\ReservationResource;
use App\Http\Resources\SensorResource;
use App\Models\Data;
use App\Models\Price;
use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Models\Sensor;
use Carbon\Carbon;

class SensorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sensors = Sensor::all();
        $reservations = Reservation::where('status', 'activa')->get();
        $price = Price::find(1);

        return inertia('Sensor/Index', [
            'sensors' => $sensors,
            'reservations' => $reservations,
            'price' => $price ?? 1,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Valida la solicitud, solo se valida el user_id
        $request->validate([
            'user_id' => 'nullable|exists:users,id',  // Asegúrate de que el user_id exista en la tabla de users
        ]);

        // Busca el sensor por ID
        $sensor = Sensor::findOrFail($id);

        // Actualiza solo el user_id
        $sensor->update($request->only(['user_id']));

        // Devuelve una respuesta (puedes ajustar esto según tus necesidades)
        //return response()->json(['message' => 'Sensor updated successfully', 'sensor' => $sensor]);
        broadcast(new ParkingAcceptedUser($sensor->id, $sensor->user_id, $sensor->occupied));
        return redirect()->route('sensors.index')->with('success', 'Sensor updated successfully');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function updateByName(Request $request, string $name)
    {
        // Busca el sensor por nombre
        $sensor = Sensor::where('name', $name)->firstOrFail();

        if (($request->input('occupied') === 1.0 || $request->input('occupied') === 1) && $sensor->occupied === 0) {
            $sensor->update([
                'occupied' => $request->input('occupied'),
                'start_time' => now(),
                'end_time' => null,
                'user_id' => null,
            ]);
            broadcast(new ParkingStatusUpdated($sensor->id, $sensor->occupied, $sensor->start_time));
        }

        if (($request->input('occupied') === 0.0 || $request->input('occupied') === 0) && $sensor->occupied === 1) {
            $sensor->update([
                'occupied' => $request->input('occupied'),
                'end_time' => now(),
                'user_id' => null,
            ]);

            $start_time = Carbon::parse($sensor->start_time); // Convierte start_time a un objeto Carbon
            $end_time = Carbon::parse(now()); // Convierte end_time (ahora) a un objeto Carbon

            $timer_seconds = $start_time->diffInSeconds($end_time);

            $costPerMinute = Price::first()->value ?? 1;

            $price = (float) $timer_seconds * ($costPerMinute / 60);

            // Crear un nuevo registro en la tabla Data
            Data::create([
                'user_id' => $sensor->user_id ?? 4,
                'sensor_id' => $sensor->id,
                'start_time' => $sensor->start_time,
                'end_time' => now(),
                'timer_seconds' => $timer_seconds,
                'price' => $price,
            ]);

            broadcast(new ParkingStatusUpdated($sensor->id, $sensor->occupied, $sensor->start_time));
        }

        // Emite un evento después de actualizar el sensor
        // broadcast(new ParkingAcceptedUser($sensor->id, $sensor->user_id, $sensor->occupied));

        return redirect()->route('sensors.index')->with('success', 'Sensor updated successfully');
    }
}
