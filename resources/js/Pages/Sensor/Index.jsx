import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ContainerComponent from "@/Components/ContainerComponent";

export default function Index({
    auth,
    sensors: initialSensors,
    reservations: initialReservations,
}) {
    const [sensors, setSensors] = useState(initialSensors);
    const [reservations, setReservations] = useState(initialReservations);

    const handleParkingAcceptedUpdate = (event) => {
        console.log("Usuario Acepta transaccion:", event);

        // Actualiza el estado de los sensores
        setSensors((prevSensors) => {
            return prevSensors.map((sensor) => {
                // Verifica si el sensor necesita ser actualizado
                if (sensor.id === event.parkingId) {
                    // Devuelve una copia del sensor con el nuevo estado `occupied`
                    return { ...sensor, user_id: event.userId }; // Actualiza el atributo `occupied`
                }
                return sensor; // Retorna el sensor sin cambios
            });
        });
    };

    const handleParkingStatusUpdate = (event) => {
        console.log("Estado del estacionamiento actualizado:", event);

        // Actualiza el estado de los sensores
        setSensors((prevSensors) => {
            return prevSensors.map((sensor) => {
                // Verifica si el sensor necesita ser actualizado
                if (sensor.id === event.parkingId) {
                    // Devuelve una copia del sensor con el nuevo estado `occupied`
                    return {
                        ...sensor,
                        occupied: event.occupied,
                        start_time: event.start_time,
                        user_id: null,
                    }; // Actualiza el atributo `occupied`
                }
                return sensor; // Retorna el sensor sin cambios
            });
        });
    };

    const handleReservationsUpdate = (newReservation) => {
        setReservations((prevReservations) => {
            if (newReservation.status === "inactiva") {
                return prevReservations.filter(
                    (reservation) => reservation.id !== newReservation.id
                );
            }

            if (newReservation.status === "activa") {
                const existingReservation = prevReservations.find(
                    (reservation) => reservation.id === newReservation.id
                );

                if (!existingReservation) {
                    return [...prevReservations, newReservation];
                }
            }

            return prevReservations;
        });
    };

    useEffect(() => {
        const parkingStatusListener = Echo.private("parking-status").listen(
            "ParkingStatusUpdated",
            (event) => {
                handleParkingStatusUpdate(event);
            }
        );

        const parkingAcceptedListener = Echo.private("parking-accepted").listen(
            "ParkingAcceptedUser",
            (event) => {
                handleParkingAcceptedUpdate(event);
            }
        );

        const sensorUpdated = Echo.channel("mqtt-messages").listen(
            "MessageReceived",
            (event) => {
                const topic = event.topic;

                try {
                    const parsedValue = JSON.parse(event.value);

                    if (parsedValue.value !== undefined) {
                        console.log("Topic:", topic);
                        console.log("Value:", parsedValue.value);
                    } else {
                        console.log("Value is undefined in parsed value.");
                    }
                } catch (e) {
                    console.error("Error parsing event.value:", e);
                }
            }
        );

        const reservationUpdated = Echo.channel("reservation").listen(
            "ReservationActivation",
            (event) => {
                console.log(event.reservation);
                handleReservationsUpdate(event.reservation);
            }
        );

        // Función de limpieza para eliminar los listeners
        return () => {
            Echo.leave("parking-status");
            Echo.leave("parking-accepted");
            Echo.leave("mqtt-messages");
            Echo.leave("reservation");
        };
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Estacionamiento
                </h2>
            }
        >
            <Head title="Sensores" />

            <ContainerComponent
                data={sensors}
                user={auth.user}
                reservations={reservations}
            />

            {/* <pre>{JSON.stringify(sensors, undefined, 2)}</pre> */}
            {/* <pre>{JSON.stringify(reservations, undefined, 2)}</pre> */}
            {/* <pre>{JSON.stringify(sensors, undefined, 2)}</pre> */}
        </AuthenticatedLayout>
    );
}
