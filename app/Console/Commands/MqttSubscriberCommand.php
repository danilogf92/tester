<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\MqttSubscriberJob;
use Illuminate\Support\Facades\Log;

class MqttSubscriberCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mqtt:subscriber';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('Dispatching MQTT Subscriber Job...');
        // Despachar el job para manejar la suscripción
        MqttSubscriberJob::dispatch()->onQueue('mqtt');
        Log::info('MQTT Subscriber Job dispatched.');
    }
}
