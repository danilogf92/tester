<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ParkingStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $parkingId;
    public $occupied;
    public $start_time;

    public function __construct($parkingId, $occupied, $start_time)
    {
        $this->parkingId = $parkingId;
        $this->occupied = $occupied;
        $this->start_time = $start_time;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('parking-status');
    }
}
