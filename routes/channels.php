<?php

use Illuminate\Support\Facades\Broadcast;

// Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

// Define el canal como público
Broadcast::channel('parking-status', function () {
    return true; // No se requiere ninguna lógica de autorización
});
