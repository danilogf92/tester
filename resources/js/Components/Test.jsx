import React, { useState, useEffect } from "react";
import mqtt from "mqtt";

const URL = "ws://5.161.190.168:8083//mqtt";
const desconectado = "Desconectado";

const Test = () => {
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState(desconectado);
  const [payload, setPayload] = useState(null);

  const host = URL;
  const mqttOptions = {
    clientId: "esp32Dev_1",
    username: "esp32",
    password: "danilo-tech",
    keepalive: 30,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  useEffect(() => {
    const mqttConnect = () => {
      setConnectStatus("Conectando");
      const newClient = mqtt.connect(host, mqttOptions);
      setClient(newClient);
    };

    mqttConnect();
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setConnectStatus("Conectado");
        console.log("Conectado al broker MQTT");

        // Suscribir a un tópico, por ejemplo, 'esp32/sensor'
        client.subscribe("esp32/sensores", { qos: 0 }, (error) => {
          if (error) {
            console.error("Error en la subscripcion:", error);
          } else {
            console.log("Suscrito al topico: esp32/sensor");
          }
        });
      });

      client.on("error", (err) => {
        console.error("Error en la conexion: ", err);
        setConnectStatus("Error en la Conexion");
        client.end();
      });

      client.on("reconnect", () => {
        setConnectStatus("Reconectando");
      });

      client.on("message", (topic, message) => {
        let parsedMessage;

        try {
          // Convierte el mensaje a string y luego intenta parsearlo como JSON
          parsedMessage = JSON.parse(message.toString());
          console.log(JSON.parse(message.toString()));
        } catch (error) {
          // Si ocurre un error en el parseo, registra el error y muestra el mensaje original como texto
          console.error("Failed to parse message as JSON:", error);
          parsedMessage = message.toString(); // Mantén el mensaje como texto si no es JSON válido
        }

        const receivedPayload = {
          topic,
          message: parsedMessage.value, // El mensaje será el objeto JSON o texto dependiendo del resultado del parseo
        };

        setPayload(receivedPayload);
        console.log("Mensaje:", receivedPayload);
      });

      client.on("close", () => {
        setConnectStatus(desconectado);
        console.log(`MQTT Cliente ${desconectado}`);
      });
    }
  }, [client]);

  return (
    <div>
      <h1> Equipo {connectStatus}</h1>
      {payload && (
        <div>
          <p>Topic: {payload.topic}</p>
          <p>Message: {payload.message}</p>
        </div>
      )}
    </div>
  );
};

export default Test;
