<?php

namespace App\Services;

use App\Events\ParkingStatusUpdated;
use App\Models\Data;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use App\Models\Sensor;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class MQTTService
{
    protected $client;

    public function __construct()
    {
        try {
            $host = config('mqtt.host');
            $port = config('mqtt.port');
            $clientId = config('mqtt.client_id');

            $connectionSettings = (new ConnectionSettings)
                ->setUsername(config('mqtt.username'))
                ->setPassword(config('mqtt.password'))
                ->setKeepAliveInterval(60);

            $this->client = new MqttClient($host, $port, $clientId);
            $this->client->connect($connectionSettings, true);
        } catch (\Exception $e) {
            Log::error('Error al conectar con MQTT: ' . $e->getMessage());
            echo "Error al conectar con MQTT: {$e->getMessage()}\n";
        }
    }

    public function listen()
    {
        try {
            // Suscribirse a los tópicos de los sensores
            $this->client->subscribe('esp32/sensor 1', function (string $topic, string $message) {
                $this->handleMessage(1, $topic, $message);
            }, 0);

            $this->client->subscribe('esp32/sensor 2', function (string $topic, string $message) {
                $this->handleMessage(2, $topic, $message);
            }, 0);

            $this->client->subscribe('esp32/sensor 3', function (string $topic, string $message) {
                $this->handleMessage(3, $topic, $message);
            }, 0);

            $this->client->subscribe('esp32/sensor 4', function (string $topic, string $message) {
                $this->handleMessage(4, $topic, $message);
            }, 0);

            $this->client->loop(true);  // Iniciar bucle de escucha
        } catch (\Exception $e) {
            Log::error('Error al suscribirse o ejecutar el loop MQTT: ' . $e->getMessage());
            echo "Error en el servicio MQTT: {$e->getMessage()}\n";
        }
    }

    protected function handleMessage($sensorId, $topic, $message)
    {
        try {
            echo "Mensaje recibido en $topic: $message id= $sensorId\n";
            $this->updateSensorState($sensorId, $message);
            $sensorData = json_decode($message, true);
            broadcast(new ParkingStatusUpdated($sensorId, $sensorData['value']));
        } catch (\Exception $e) {
            Log::error("Error al manejar el mensaje del sensor $sensorId: " . $e->getMessage());
            echo "Error manejando mensaje: {$e->getMessage()}\n";
        }
    }

    protected function updateSensorState($sensorId, $message)
    {
        try {
            $sensorData = json_decode($message, true);
            $sensor = Sensor::find($sensorId);
            $user = Auth::user();

            //dd($user);  // Para depuración, pero puede ser eliminado para producción

            if ($sensorData['value'] === 1.00 && !$sensor->occupied) {
                $sensor->update([
                    'occupied' => true,
                    'start_time' => now(),
                    'end_time' => null,
                    'user_id' => null
                ]);
            } elseif ($sensorData['value'] === 0.00 && $sensor->occupied) {
                $startTime = Carbon::parse($sensor->start_time);
                $endTime = Carbon::now();
                $timerSeconds = $startTime->diffInSeconds($endTime);
                $price = 100.00;

                $createdData = Data::create([
                    'user_id' => $sensor->user_id ?? 1,
                    'timer_seconds' => $timerSeconds,
                    'price' => $price,
                    'sensor_id' => $sensor->id,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                ]);

                if ($createdData) {
                    echo "Data creada correctamente.\n";
                } else {
                    echo "Fallo al crear la data.\n";
                }

                $sensor->update([
                    'occupied' => false,
                    'end_time' => now(),
                ]);
                echo "Sensor $sensorId actualizado a desocupado.\n";
            }
        } catch (\Exception $e) {
            Log::error("Error al actualizar el estado del sensor $sensorId: " . $e->getMessage());
            echo "Error actualizando estado del sensor: {$e->getMessage()}\n";
        }
    }

    public function __destruct()
    {
        try {
            $this->client->disconnect();
        } catch (\Exception $e) {
            Log::warning('Error al desconectar el cliente MQTT: ' . $e->getMessage());
            echo "Error al desconectar: {$e->getMessage()}\n";
        }
    }
}
