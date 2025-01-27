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
use PhpMqtt\Client\Facades\MQTT;

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
        try {
            $mqtt = MQTT::connection();

            $mqtt->subscribe('esp32/#', function (string $topic, string $message) use ($mqtt) {
                Log::info("Received message on topic '$topic': $message");
                try {
                    $occupied = $message;

                    $sensorName = trim(Str::after($topic, 'esp32/'));

                    $data = json_decode(
                        $message,
                        true
                    );
                    $value = isset($data['value']) ? $data['value'] : null;

                    $sensorController = app(SensorController::class);
                    $sensorController->updateByName(new Request(['occupied' => $value]), $sensorName);

                    Log::warning("Received message on topic '$topic': $message");

                    broadcast(new MessageReceived($topic, $message));
                } catch (\Exception $e) {
                    Log::error("Failed to broadcast event: " . $e->getMessage());
                }
                $mqtt->interrupt();
            }, MqttClient::QOS_EXACTLY_ONCE);

            $mqtt->loop(true);

            $mqtt->disconnect();
        } catch (MqttClientException $e) {
            Log::error("An error occurred while subscribing to MQTT topic: " . $e->getMessage());
        }
    }
}
