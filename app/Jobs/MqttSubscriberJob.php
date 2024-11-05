<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use PhpMqtt\Client\ConnectionSettings;
use PhpMqtt\Client\Exceptions\MqttClientException;
use PhpMqtt\Client\MqttClient;
use App\Events\MessageReceived;
use App\Http\Controllers\SensorController;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MqttSubscriberJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $host = config('mqtt.host');
        $port = config('mqtt.port');
        $clientId = config('mqtt.client_id');

        $connectionSettings = (new ConnectionSettings)
            ->setUsername(config('mqtt.username'))
            ->setPassword(config('mqtt.password'))
            ->setKeepAliveInterval(60)
            ->setLastWillTopic('esp32/last-will')
            ->setLastWillMessage('client disconnect')
            ->setReconnectAutomatically(true)
            ->setLastWillQualityOfService(0);

        $mqtt = new MqttClient($host, $port, $clientId);

        try {
            Log::info('Connecting to MQTT Broker...');
            $mqtt->connect($connectionSettings, false);
            Log::info('Connected to MQTT Broker.');

            // Suscribirse al tema
            $mqtt->subscribe('esp32/#', function (string $topic, string $message) {
                Log::info("Received message on '$topic': $message");

                try {
                    // $sensorName = $topic;  // O extraerlo desde el $message si es necesario
                    $occupied = $message; // Ejemplo: convierte el mensaje a un booleano

                    $sensorName = Str::after($topic, 'esp32/');

                    $data = json_decode(
                        $message,
                        true
                    );

                    // Accede al valor de "value"
                    $value = isset($data['value']) ? $data['value'] : null;

                    // Llama al controlador para actualizar el valor del sensor
                    $sensorController = app(SensorController::class);
                    $sensorController->updateByName(new Request(['occupied' => $value]), $sensorName);

                    broadcast(new MessageReceived($topic, $message));
                } catch (\Exception $e) {
                    Log::error("Failed to broadcast event: " . $e->getMessage());
                }
                // $mqtt->interrupt();
            }, MqttClient::QOS_AT_MOST_ONCE);

            $mqtt->loop();
            $mqtt->disconnect();
        } catch (MqttClientException $e) {
            Log::error("An error occurred while subscribing to MQTT topic: " . $e->getMessage());
        } finally {
            $mqtt->disconnect();
            Log::info('Disconnected from MQTT Broker.');
        }
    }
}
