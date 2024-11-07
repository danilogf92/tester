import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

const CarItem = ({ item, user }) => {
    const [tiempoTranscurrido, setTiempoTranscurrido] = useState("");
    const { data, setData, put, errors } = useForm({
        user_id: user.id,
        timer_seconds: 3600,
        price: 100.0,
        start_time: item.start_time,
        end_time: item.start_time,
    });

    const [userPayment, setUserPayment] = useState(false);
    const [status, setStatus] = useState(item.occupied);

    const [sensor, setSensor] = useState({
        sensor_id: item.id,
        user_id: item.user_id || "",
        occupied: item.occupied,
        start_time: item.start_time,
        end_time: 0,
    });

    // Actualiza el estado del sensor cuando `item` cambia
    useEffect(() => {
        setSensor({
            sensor_id: item.id,
            user_id: item.user_id || "",
            occupied: item.occupied,
            start_time: item.start_time,
            end_time: 0,
        });
        setStatus(item.occupied); // Asegúrate de actualizar el estado aquí
    }, [item]);

    useEffect(() => {
        if (item.occupied && item.start_time) {
            const interval = setInterval(() => {
                const ahora = new Date();
                const inicio = new Date(item.start_time);
                const diferencia = ahora - inicio;

                const horasTranscurridas = Math.floor(
                    diferencia / (1000 * 60 * 60)
                );
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
    }, [item.occupied, item.start_time, item]);

    const handleClick = async (e, item, user_id) => {
        e.preventDefault();
        setStatus(true); // Cambia el estado aquí

        // Actualiza el sensor en el padre
        setSensor((prevSensor) => ({
            ...prevSensor,
            user_id: user_id, // Actualiza el user_id
        }));

        await put(
            route("sensors.update", item.id),
            { user_id },
            {
                onSuccess: () => {
                    console.log("Data updated successfully");
                    // Actualiza el estado del sensor si es necesario
                    setStatus(true); // Actualiza el estado `status`
                },
                onError: (errors) => {
                    console.error("Error updating data:", errors);
                },
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-300 rounded-md p-4 shadow-md shadow-gray-300">
            <div className="text-lg font-bold mb-2">
                {status ? (
                    <>
                        <h4 className="bg-red-200 shadow-sm rounded-md p-2 text-center">
                            {`Estacionamiento # ${item.id} Ocupado`}
                        </h4>
                        <h5 className="text-sm">{`Inicio: ${new Date(
                            item.start_time
                        ).toLocaleString("es-ES", {
                            timeZone: "America/Guayaquil",
                        })} | Tiempo: ${tiempoTranscurrido}`}</h5>
                    </>
                ) : (
                    <h4 className="bg-green-200 shadow-sm rounded-sm p-2 text-gray-500">
                        {`Estacionamiento # ${item.id} Libre`}
                    </h4>
                )}
            </div>
            <div className="flex flex-col items-center">
                <img
                    src={status ? `/img/auto-1.png` : `/img/libre.png`}
                    alt={status ? "CarImg" : "LibreImg"}
                    className="h-24 sm:h-24 w-full object-contain mb-4"
                />

                {/* Mostrar usuario si está ocupado */}
                {item.occupied === 1 && item.user_id !== null && (
                    <div className="flex space-x-4 mb-4">
                        <h5>Usuario #: {item.user_id}</h5>
                    </div>
                )}

                {/* Botón para aceptar cargo si está ocupado y no tiene usuario asignado */}
                {item.occupied === 1 && item.user_id === null && (
                    <div className="flex space-x-4">
                        <button
                            onClick={(e) => handleClick(e, item, user.id)}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Aceptar Cargo
                        </button>
                    </div>
                )}
            </div>
            {/* <pre>{JSON.stringify(item, undefined, 2)}</pre>  */}
        </div>
    );
};

export default CarItem;
