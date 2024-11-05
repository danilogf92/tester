<?php

namespace App\Jobs;

use App\Models\Reservation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ActivateReservationJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    protected $reservation;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    public function handle()
    {
        // Activar la reserva
        $this->reservation->update(['status' => 'active']);

        // // Programar el job de desactivación para después de la duración de la reserva
        // $deactivationTime = now()->addMinutes($this->reservation->duration_minutes);
        // DeactivateReservationJob::dispatch($this->reservation)->delay($deactivationTime);
    }
}
