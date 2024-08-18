import React, { useState, useEffect } from "react";

const CarComponent = ({
  status = false,
  name = "",
  fechaInicio = "",
  fechaFin = "",
  onMessage,
  user,
}) => {
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState("");
  const [userPayment, setUserPayment] = useState("");

  const handleClick = () => {
    const data = { sensor: name, user: user };
    onMessage(data);
    setUserPayment(user);
    console.log(
      `Cargar el id del user desde ${name} usuario ${user.id} ${user.name}`
    );
  };

  useEffect(() => {
    if (status && fechaInicio) {
      const interval = setInterval(() => {
        const ahora = new Date();
        const inicio = new Date(fechaInicio); // Asegúrate de que fechaInicio esté en formato ISO

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
  }, [status, fechaInicio]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 border border-gray-300 rounded-md p-4 shadow-md shadow-gray-300">
      <div className="text-lg font-bold mb-2">
        {!status && (
          <h4 className="bg-green-200 shadow-sm rounded-sm p-2">
            {`${name} Libre `}
          </h4>
        )}
        {status && (
          <>
            <h4 className="bg-red-200 shadow-sm rounded-sm p-2 text-center">
              {`${name} Ocupado `}
            </h4>
            <h5>
              Inicio: {new Date(fechaInicio).toLocaleString("es-ES")} tiempo :{" "}
              {tiempoTranscurrido}
            </h5>
            {/* <h5>
              Fin:{" "}
              {fechaFin ? new Date(fechaFin).toLocaleString("es-ES") : "N/A"}
            </h5>
            <h5>Tiempo Transcurrido: {tiempoTranscurrido}</h5> */}
          </>
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
        {status && (
          <img
            src={`/img/auto-1.png`}
            alt="CarImg"
            className="h-32 sm:h-32 w-full object-contain"
          />
        )}

        <div className="flex space-x-4">
          {/* {!status && (
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Iniciar
            </button>
          )} */}

          {status && !userPayment && (
            <button
              onClick={handleClick}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Aceptar Cargo
            </button>
          )}

          {userPayment.name && <h5>Usuario: {userPayment.name}</h5>}
        </div>
      </div>
    </div>
  );
};

export default CarComponent;
