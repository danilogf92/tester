<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Jobs\ActivateReservationJob;
use App\Jobs\DeactivateReservationJob;
use App\Models\Price;
use App\Models\Reservation;
use App\Models\Sensor;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReservationController extends Controller
{
    /**
     * Display a listing of the reservations.
     */
    public function index(Request $request)
    {
        $userId = auth()->id(); // Obtener el ID del usuario autenticado
        $query = Reservation::where('user_id', $userId);

        if ($request->has('date') && $request->date) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('sensor_id') && $request->sensor_id) {
            $query->where('sensor_id', $request->sensor_id);
        }

        if ($request->has('rows') && $request->rows) {
            $rowsPerPage = $request->input('rows', $request->rows);
        } else {
            $rowsPerPage = $request->input('rows', 10);
        }

        if ($rowsPerPage === 'all') {
            $reservation = $query->orderBy('date', 'DESC')
                ->orderBy('sensor_id', 'ASC')
                ->get();
        } else {
            $reservation = $query->orderBy('date', 'DESC')
                ->orderBy('sensor_id', 'ASC')
                ->paginate((int)$rowsPerPage);
        }

        $sensors = Sensor::orderBy('name', 'ASC')->get();

        return inertia('Reservation/Index', [
            "reservations" => ReservationResource::collection($reservation),
            "sensors" => $sensors,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Store a newly created reservation in storage.
     */
    public function store(StoreReservationRequest $request)
    {
        $reservationData = $request->validated();


        $costPerMinute = Price::first()->value ?? 1;

        $reservationData['cost'] = (float) $reservationData['time_reservation'] * $costPerMinute;

        $reservation = Reservation::create($reservationData);

        $activationTime = Carbon::parse("{$reservationData['date']} {$reservationData['time']}");

        $timeReservationMinutes = (int) $reservationData['time_reservation'];

        $deactivationTime = $activationTime->copy()->addMinutes($timeReservationMinutes);

        ActivateReservationJob::dispatch($reservation)->delay($activationTime)->onQueue('reservations');
        DeactivateReservationJob::dispatch($reservation)->delay($deactivationTime)->onQueue('reservations');

        return redirect()->route('reservations.index')->with('success', 'Reserva creada y programada con éxito.');
    }

    /**
     * Display the specified reservation.
     */
    public function show($id)
    {
        $reservation = Reservation::findOrFail($id);

        return response()->json($reservation);
    }

    public function create()
    {
        $sensors = Sensor::orderBy('name', 'ASC')->get();

        return inertia('Reservation/Create', [
            "sensors" => $sensors,
            'queryParams' => request()->query() ?: null
        ]);
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return redirect()->route('reservations.index')->with('success', 'Reservacion borrada de forma existosa.');
    }
}
