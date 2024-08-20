import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

const ContainerComponent = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 mr-2 ml-2 mt-2">
      {data.map((item) => (
        <CarItem key={item.id} item={item} />
      ))}
    </div>
  );
};

const CarItem = ({ item }) => {
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState("");
  const { data, setData, post, errors } = useForm({
    user_id: 1,
    timer_seconds: 3600,
    price: 100.0,
    start_time: item.start_time,
    end_time: item.start_time,
  });

  useEffect(() => {
    if (item.occupied && item.start_time) {
      const interval = setInterval(() => {
        const ahora = new Date();
        const inicio = new Date(item.start_time);

        const diferencia = ahora - inicio;

        const horasTranscurridas = Math.floor(diferencia / (1000 * 60 * 60));
        const minutosTranscurridos = Math.floor(
          (diferencia % (1000 * 60 * 60)) / (1000 * 60)
        );
        const segundosTranscurridos = Math.floor(
          (diferencia % (1000 * 60)) / 1000
        );

        setTiempoTranscurrido(
          `${horasTranscurridas
            .toString()
            .padStart(2, "0")}:${minutosTranscurridos
            .toString()
            .padStart(2, "0")}:${segundosTranscurridos
            .toString()
            .padStart(2, "0")}`
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [item.occupied, item.start_time]);

  const status = item.occupied;
  const name = `Parqueadero ${item.id}`;
  const fechaInicio = item.start_time;
  const userPayment = false;

  // const handleClick = () => {
  //   console.log(`Cargar el id del user desde ${name}`);
  // };

  const handleClick = async () => {
    post(route("data.store"), data, {
      onSuccess: () => {
        // Mostrar un mensaje de éxito o realizar cualquier otra acción
        console.log("Data stored successfully");
      },
      onError: (errors) => {
        console.error("Error storing data:", errors);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 border border-gray-300 rounded-md p-4 shadow-md shadow-gray-300">
      <div className="text-lg font-bold mb-2">
        {status ? (
          <>
            <h4 className="bg-red-200 shadow-sm rounded-sm p-2 text-center">
              {`${name} Ocupado `}
            </h4>
            <h5>
              Inicio:{" "}
              {new Date(fechaInicio).toLocaleString("es-ES", {
                timeZone: "America/Guayaquil",
              })}{" "}
              tiempo: {tiempoTranscurrido}
            </h5>
          </>
        ) : (
          <h4 className="bg-green-200 shadow-sm rounded-sm p-2">
            {`${name} Libre `}
          </h4>
        )}
      </div>

      <div>
        {!status && (
          <img
            src={`/img/libre.png`}
            alt="LibreImg"
            className="h-32 sm:h-32 w-full object-contain"
          />
        )}

        {status ? (
          <img
            src={`/img/auto-1.png`}
            alt="CarImg"
            className="h-32 sm:h-32 w-full object-contain"
          />
        ) : null}

        <div className="flex space-x-4">
          {status && !userPayment ? (
            <button
              onClick={handleClick}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Aceptar Cargo
            </button>
          ) : (
            userPayment && <h5>Usuario: {userPayment.name}</h5>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContainerComponent;
