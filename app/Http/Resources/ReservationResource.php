<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_name' => $this->user->name,
            'reservation_date' => (new Carbon($this->date))->format('Y-m-d'),
            'reservation_time' => (new Carbon($this->time))->format('H:i:s'),
            // 'reservation_duration' => (new Carbon($this->time_reservation))->format('H:i:s'),
            'reservation_duration' => $this->time_reservation,
            'reservation_parking' => $this->sensor->name,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
