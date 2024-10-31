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
    protected $host;
    protected $port;
    protected $clientId;

    public function __construct()
    {
        $this->host = config('mqtt.host');
        $this->port = config('mqtt.port');
        $this->clientId = config('mqtt.client_id');

        $this->connect();
    }

    private function connect()
    {
        try {
            $connectionSettings = (new ConnectionSettings)
                ->setUsername(config('mqtt.username'))
                ->setPassword(config('mqtt.password'))
                ->setKeepAliveInterval(10)  // Reduce el tiempo de keep alive a 10 segundos
                ->setSocketTimeout(10);      // Aumenta el tiempo de espera del socket

            $this->client = new MqttClient($this->host, $this->port, $this->clientId);
            $this->client->connect($connectionSettings, true);
        } catch (\Exception $e) {
            Log::error('Error al conectar con MQTT: ' . $e->getMessage());
            echo "Error al conectar con MQTT: {$e->getMessage()}\n";
        }
    }

    public function listen()
    {
        while (true) {
            try {
                $this->subscribeToTopics();

                // Iniciar el bucle de escucha
                $this->client->loop(true, 5);  // Escucha con 5 segundos de intervalo de loop
            } catch (\Exception $e) {
                Log::error('Error en el servicio MQTT: ' . $e->getMessage());
                echo "Error en el servicio MQTT: {$e->getMessage()}\n";

                // Intentar reconectar después de un tiempo de espera
                sleep(2);
                $this->connect();
            }
        }
    }

    protected function subscribeToTopics()
    {
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
    }

    protected function handleMessage($sensorId, $topic, $message)
    {
        try {
            echo "Mensaje recibido en $topic: $message id= $sensorId\n";
            $this->updateSensorState($sensorId, $message);
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

            if ($sensorData['value'] === 1.00 && !$sensor->occupied) {
                $sensor->update([
                    'occupied' => true,
                    'start_time' => now(),
                    'end_time' => null,
                    'user_id' => null
                ]);

                $formattedStartTime = Carbon::parse($sensor->start_time)->format('Y-m-d H:i:s');
                broadcast(new ParkingStatusUpdated($sensor->id, $sensor->occupied, $formattedStartTime));
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

                $sensor->update([
                    'occupied' => false,
                    'end_time' => now(),
                ]);
                broadcast(new ParkingStatusUpdated($sensor->id, $sensor->occupied, null));
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
