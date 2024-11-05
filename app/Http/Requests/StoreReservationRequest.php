<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id', // Asegúrate de que el usuario exista
            'sensor_id' => 'required|exists:sensors,id', // Asegúrate de que el sensor exista
            'date' => 'required|date|after_or_equal:today', // La fecha debe ser hoy o futura
            'time' => 'required|date_format:H:i', // El formato de la hora debe ser correcto
            'time_reservation' => 'required|in:1,5,15,30,45,60,75,90', // Asegúrate de que el tiempo de reserva esté entre las opciones permitidas
        ];
    }

    /**
     * Get the validation messages for the defined rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'user_id.required' => 'El campo usuario es obligatorio.',
            'user_id.exists' => 'El usuario seleccionado no existe.',
            'sensor_id.required' => 'El campo sensor es obligatorio.',
            'sensor_id.exists' => 'El sensor seleccionado no existe.',
            'date.required' => 'El campo fecha es obligatorio.',
            'date.date' => 'El campo fecha debe ser una fecha válida.',
            'date.after_or_equal' => 'La fecha debe ser hoy o una fecha futura.',
            'time.required' => 'El campo hora es obligatorio.',
            'time.date_format' => 'El campo hora debe tener el formato HH:MM.',
            'time_reservation.required' => 'El campo tiempo de reserva es obligatorio.',
            'time_reservation.in' => 'El tiempo de reserva debe ser uno de los siguientes valores: 15, 30, 45, 60, 75, 90.',
        ];
    }
}
