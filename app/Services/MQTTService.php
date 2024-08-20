<?php

namespace App\Services;

use App\Models\Data;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use App\Models\Sensor;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class MQTTService
{
    protected $client;

    public function __construct()
    {
        $host = config('mqtt.host');
        $port = config('mqtt.port');
        $clientId = config('mqtt.client_id');

        $connectionSettings = (new ConnectionSettings)
            ->setUsername(config('mqtt.username'))
            ->setPassword(config('mqtt.password'))
            ->setKeepAliveInterval(60);

        $this->client = new MqttClient($host, $port, $clientId);
        $this->client->connect($connectionSettings, true);
    }

    public function listen()
    {
        // Suscribirse a los tópicos de los sensores
        $this->client->subscribe('esp32/sensor 1', function (string $topic, string $message) {
            echo "Mensaje recibido en $topic: $message\n";  // Mensaje de depuración en consola
            //Log::info("Mensaje recibido en $topic: $message");  // Mensaje de depuración en los logs
            $this->updateSensorState(1, $message);
        }, 0);

        $this->client->subscribe('esp32/sensor 2', function (string $topic, string $message) {
            echo "Mensaje recibido en $topic: $message\n";  // Mensaje de depuración en consola
            //Log::info("Mensaje recibido en $topic: $message");  // Mensaje de depuración en los logs
            $this->updateSensorState(2, $message);
        }, 0);

        $this->client->subscribe('esp32/sensor 3', function (string $topic, string $message) {
            echo "Mensaje recibido en $topic: $message\n";  // Mensaje de depuración en consola
            //Log::info("Mensaje recibido en $topic: $message");  // Mensaje de depuración en los logs
            $this->updateSensorState(3, $message);
        }, 0);

        $this->client->subscribe('esp32/sensor 4', function (string $topic, string $message) {
            echo "Mensaje recibido en $topic: $message\n";  // Mensaje de depuración en consola
            //Log::info("Mensaje recibido en $topic: $message");  // Mensaje de depuración en los logs
            $this->updateSensorState(4, $message);
        }, 0);

        $this->client->loop(true);
    }

    protected function updateSensorState($sensorId, $message)
    {
      //  echo "Sensor $sensorId y $message\n";
        $sensorData = json_decode($message, true);
        $sensor = Sensor::find($sensorId);

        if ($sensorData['value'] === 1 && !$sensor->occupied) {
          
            $sensor->update([
                'occupied' => true,
                'start_time' => now(),
                'end_time' => null,
            ]);
            //Log::info("Sensor $sensorId actualizado a ocupado.");  // Depuración en logs
        } elseif ($sensorData['value'] === 0 && $sensor->occupied) {
            // $startTime = $sensor->start_time;
            // $endTime = now();
            // $timerSeconds = $endTime->diffInSeconds($startTime);

            $startTime = Carbon::parse($sensor->start_time);  // Asegúrate de que start_time es un objeto Carbon
            $endTime = Carbon::now();  // end_time como objeto Carbon

            $timerSeconds = $startTime->diffInSeconds($endTime);

            // Aquí podrías calcular el precio basado en el tiempo, o usar un valor fijo
            $price = 100.00; // Ejemplo: usa un precio fijo, o calcula basado en el tiempo

            // Crear el registro en 'data'
            $createdData = Data::create([
                'user_id' => 1, // Asegúrate de usar el user_id correcto o extraerlo según tu lógica
                'timer_seconds' => $timerSeconds,
                'price' => $price,
                'sensor_id' => $sensor->id,
                'start_time' => $startTime,
                'end_time' => $endTime,
            ]);
 
            if ($createdData) {
                echo "Data created successfully: ";
            } else {
                echo "Failed to create Data for sensor";
            }

            $sensor->update([
                'occupied' => false,
                'end_time' => now(),
            ]);
            echo "Sensor $sensorId actualizado a desocupado.\n";  // Depuración
            //Log::info("Sensor $sensorId actualizado a desocupado.");  // Depuración en logs
        }
    }

    public function __destruct()
    {
        $this->client->disconnect();
    }
}
