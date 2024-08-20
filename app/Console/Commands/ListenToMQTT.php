<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\MQTTService;

class ListenToMQTT extends Command
{
    // Define el nombre del comando en la terminal
    protected $signature = 'mqtt:listen';
    
    // Descripción del comando, que se muestra al ejecutar `php artisan list`
    protected $description = 'Escucha los mensajes MQTT y actualiza los sensores';

    protected $mqttService;

    // Constructor que inyecta el servicio MQTT
    public function __construct(MQTTService $mqttService)
    {
        parent::__construct();
        $this->mqttService = $mqttService;
    }

    // El método handle es lo que se ejecuta cuando llamas al comando
    public function handle()
    {
        // Llama al método listen del servicio MQTT para empezar a escuchar los mensajes
        $this->mqttService->listen();
    }
}
