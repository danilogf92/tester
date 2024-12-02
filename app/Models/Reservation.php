<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'date',
        'time',
        'time_reservation',
        'sensor_id',
        'user_id',
        'cost'
    ];

    /**
     * Relación con el modelo Sensor.
     * Una reserva pertenece a un sensor.
     */
    public function sensor()
    {
        return $this->belongsTo(Sensor::class);
    }

    /**
     * Relación con el modelo User.
     * Una reserva puede estar asociada a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
