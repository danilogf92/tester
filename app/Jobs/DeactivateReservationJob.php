<?php

namespace App\Jobs;

use App\Events\ReservationActivation;
use App\Models\Reservation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeactivateReservationJob implements ShouldQueue
{
    use Queueable;

    protected $reservation;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    public function handle()
    {
        $value = 'inactiva';
        $this->reservation->update(['status' => $value]);
        broadcast(new ReservationActivation($this->reservation));
    }
}
