<?php

return [
    'host' => env('MQTT_HOST', '5.161.190.168'),
    'port' => env('MQTT_PORT', 1883),
    'username' => env('MQTT_USERNAME', 'esp32'),
    'password' => env('MQTT_PASSWORD', 'danilo-tech'),
    'client_id' => env('MQTT_CLIENT_ID', 'LaravelMQTTClient'),
];
