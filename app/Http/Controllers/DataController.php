<?php

namespace App\Http\Controllers;

use App\Models\Data;
use Illuminate\Http\Request;

class DataController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        // // Validar la solicitud
        // $validated = $request->validate([
        //     'user_id' => 'required|exists:users,id',
        //     'timer_seconds' => 'required|numeric',
        //     'price' => 'required|numeric',
        //     'sensor_id' => 'required|numeric',
        //     'start_time' => 'required|date',
        //     'end_time' => 'required|date',
        // ]);

        // try {
        //     // Intentar crear el nuevo registro en la base de datos
        //     // Data::create($validated);

        //     Data::create($validated);

        //     // Redirigir a la página de índice con un mensaje de éxito
        //     return redirect()->route('sensors.index');
        // } catch (\Exception $e) {
        //     // Manejar el error y redirigir de nuevo con un mensaje de error
        //     return redirect()->route('sensors.index')->with('error', 'Failed to store data');
        // }
    }

    /**
     * Display the specified resource.
     */
    public function show(Data $data)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Data $data)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Data $data)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Data $data)
    {
        //
    }
}
