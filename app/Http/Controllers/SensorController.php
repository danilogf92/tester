<?php

namespace App\Http\Controllers;

use App\Events\ParkingAcceptedUser;
use App\Http\Resources\SensorResource;
use Illuminate\Http\Request;
use App\Models\Sensor;

class SensorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sensors = Sensor::all();

        // Verificar si la solicitud espera una respuesta en formato JSON
        if (request()->wantsJson()) {
            return response()->json(['sensors' => SensorResource::collection($sensors)]);
        }

        return inertia('Sensor/Index', [
            "sensors" => $sensors
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
}
