import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
import FourPartComponent from "./FourPartComponent";

const MQTTConnection = ({ user }) => {
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState("Desconectado");
  const [payloads, setPayloads] = useState({
    Parqueadero_1: {
      ocupado: false,
      FechaInicio: null,
      FechaFin: null,
      user: null,
    },
    Parqueadero_2: {
      ocupado: false,
      FechaInicio: null,
      FechaFin: null,
      user: null,
    },
    Parqueadero_3: {
      ocupado: false,
      FechaInicio: null,
      FechaFin: null,
      user: null,
    },
    Parqueadero_4: {
      ocupado: false,
      FechaInicio: null,
      FechaFin: null,
      user: null,
    },
    libres: 4,
  });

  const host = "ws://5.161.190.168:8083/mqtt";
  const mqttOptions = {
    clientId: `WebClientDev_${Math.floor(Math.random() * 1000)}`,
    username: "esp32",
    password: "danilo-tech",
    clean: true,
    reconnectPeriod: 5000,
    connectTimeout: 30 * 1000,
  };

  useEffect(() => {
    const mqttConnect = () => {
      setConnectStatus("Conectando...");
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

        // Suscribir a los tópicos
        mqttSub({ topic: "esp32/sensor 1", qos: 0 });
        mqttSub({ topic: "esp32/sensor 2", qos: 0 });
        mqttSub({ topic: "esp32/sensor 3", qos: 0 });
        mqttSub({ topic: "esp32/sensor 4", qos: 0 });
        mqttSub({ topic: "esp32/libres", qos: 0 });
      });

      client.on("error", (err) => {
        console.error("Error en la Conexión: ", err);
        setConnectStatus("Error en la Conexión");
        client.end();
      });

      client.on("reconnect", () => {
        setConnectStatus("Reconexión...");
      });

      client.on("close", () => {
        setConnectStatus("Desconectado");
        console.log("MQTT Client Desconectado");
      });

      client.on("message", (topic, message) => {
        const messageJson = JSON.parse(message.toString());
        const sensor = messageJson.value === 1 ? true : false;
        handlePayload(topic, sensor);
      });
    }
  }, [client]);

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Error en la subscripción", error);
          return;
        }
        console.log(`Subscrito al topico: ${topic}`);
      });
    }
  };

  const handlePayload = (topic, ocupado) => {
    const fechaActual = new Date().toISOString(); // Esto guarda la fecha en formato ISO

    setPayloads((prevPayloads) => {
      let updatedPayloads = { ...prevPayloads };

      switch (topic) {
        case "esp32/sensor 1":
          if (!ocupado && prevPayloads.Parqueadero_1.ocupado) {
            // Imprimir en consola y resetear fechas
            console.log(
              `Parqueadero_1 - Fecha de Inicio: ${prevPayloads.Parqueadero_1.FechaInicio}, Fecha de Fin: ${fechaActual}`
            );
            updatedPayloads.Parqueadero_1 = {
              ocupado,
              FechaInicio: null,
              FechaFin: null,
            };
          } else {
            updatedPayloads.Parqueadero_1 = {
              ocupado,
              FechaInicio:
                ocupado && !prevPayloads.Parqueadero_1.ocupado
                  ? fechaActual
                  : prevPayloads.Parqueadero_1.FechaInicio,
              FechaFin: prevPayloads.Parqueadero_1.FechaFin,
            };
          }
          break;
        case "esp32/sensor 2":
          if (!ocupado && prevPayloads.Parqueadero_2.ocupado) {
            // Imprimir en consola y resetear fechas
            console.log(
              `Parqueadero_2 - Fecha de Inicio: ${prevPayloads.Parqueadero_2.FechaInicio}, Fecha de Fin: ${fechaActual}`
            );
            updatedPayloads.Parqueadero_2 = {
              ocupado,
              FechaInicio: null,
              FechaFin: null,
            };
          } else {
            updatedPayloads.Parqueadero_2 = {
              ocupado,
              FechaInicio:
                ocupado && !prevPayloads.Parqueadero_2.ocupado
                  ? fechaActual
                  : prevPayloads.Parqueadero_2.FechaInicio,
              FechaFin: prevPayloads.Parqueadero_2.FechaFin,
            };
          }
          break;
        case "esp32/sensor 3":
          if (!ocupado && prevPayloads.Parqueadero_3.ocupado) {
            // Imprimir en consola y resetear fechas
            console.log(
              `Parqueadero_3 - Fecha de Inicio: ${prevPayloads.Parqueadero_3.FechaInicio}, Fecha de Fin: ${fechaActual}`
            );
            updatedPayloads.Parqueadero_3 = {
              ocupado,
              FechaInicio: null,
              FechaFin: null,
            };
          } else {
            updatedPayloads.Parqueadero_3 = {
              ocupado,
              FechaInicio:
                ocupado && !prevPayloads.Parqueadero_3.ocupado
                  ? fechaActual
                  : prevPayloads.Parqueadero_3.FechaInicio,
              FechaFin: prevPayloads.Parqueadero_3.FechaFin,
            };
          }
          break;
        case "esp32/sensor 4":
          if (!ocupado && prevPayloads.Parqueadero_4.ocupado) {
            // Imprimir en consola y resetear fechas
            console.log(
              `Parqueadero_4 - Fecha de Inicio: ${prevPayloads.Parqueadero_4.FechaInicio}, Fecha de Fin: ${fechaActual}`
            );
            updatedPayloads.Parqueadero_4 = {
              ocupado,
              FechaInicio: null,
              FechaFin: null,
            };
          } else {
            updatedPayloads.Parqueadero_4 = {
              ocupado,
              FechaInicio:
                ocupado && !prevPayloads.Parqueadero_4.ocupado
                  ? fechaActual
                  : prevPayloads.Parqueadero_4.FechaInicio,
              FechaFin: prevPayloads.Parqueadero_4.FechaFin,
            };
          }
          break;
        case "esp32/libres":
          updatedPayloads.libres = ocupado
            ? prevPayloads.libres - 1
            : prevPayloads.libres + 1;
          break;
        default:
          break;
      }

      return updatedPayloads;
    });
  };

  const handleMessage = (msg) => {
    const { sensor, user } = msg;
    setPayloads((prevPayloads) => {
      let updatedPayloads = { ...prevPayloads };

      switch (sensor) {
        case "Parqueadero_1":
          updatedPayloads.Parqueadero_1.user = user;
          break;
        case "Parqueadero_2":
          updatedPayloads.Parqueadero_2.user = user;
          break;
        case "Parqueadero_3":
          updatedPayloads.Parqueadero_3.user = user;
          break;
        case "Parqueadero_4":
          updatedPayloads.Parqueadero_4.user = user;
          break;
        default:
          console.log(sensor);
          console.log("Sensor no reconocido");
          break;
      }

      return updatedPayloads;
    });
  };

  return (
    <div>
      <h3 className="text-center text-3xl pb-4">
        Estado del equipo:{" "}
        <span
          className={`${
            connectStatus === "Conectado" ? "bg-green-200" : "bg-yellow-200"
          } p-2 rounded-md`}
        >
          {connectStatus}
        </span>
      </h3>

      <FourPartComponent
        user={user}
        onMessage={handleMessage}
        data={payloads}
      />
    </div>
  );
};

export default MQTTConnection;
