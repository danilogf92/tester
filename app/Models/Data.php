<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Data extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'timer_seconds',
        'price',
        'sensor_id',
        'start_time',
        'end_time',
    ];    

    public function user()
    {
        return $this->belongsTo(User::class);
    }    
}
