import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ContainerComponent from "@/Components/ContainerComponent";
import Banner from "@/Components/myComponents/Banner";

export default function Index({
    auth,
    sensors: initialSensors,
    reservations: initialReservations,
    price,
}) {
    const [sensors, setSensors] = useState(initialSensors);
    const [reservations, setReservations] = useState(initialReservations);

    const handleParkingAcceptedUpdate = (event) => {
        console.log("Usuario Acepta transacción:", event);

        setSensors((prevSensors) =>
            prevSensors.map((sensor) =>
                sensor.id === event.parkingId
                    ? { ...sensor, user_id: event.userId }
                    : sensor
            )
        );
    };

    const handleParkingStatusUpdate = (event) => {
        console.log("Estado del estacionamiento actualizado:", event);

        setSensors((prevSensors) =>
            prevSensors.map((sensor) =>
                sensor.id === event.parkingId
                    ? {
                          ...sensor,
                          occupied: event.occupied,
                          start_time: event.start_time,
                          user_id: null,
                      }
                    : sensor
            )
        );
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
        console.log("Registra los listeners");
        // Registra los listeners
        const parkingStatusListener = Echo.private("parking-status").listen(
            "ParkingStatusUpdated",
            handleParkingStatusUpdate
        );

        const parkingAcceptedListener = Echo.private("parking-accepted").listen(
            "ParkingAcceptedUser",
            handleParkingAcceptedUpdate
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

        // Cleanup: desregistra los listeners cuando el componente se desmonta
        return () => {
            console.log("Limpia los listeners");

            parkingStatusListener.stopListening("ParkingStatusUpdated");
            parkingAcceptedListener.stopListening("ParkingAcceptedUser");
            sensorUpdated.stopListening("MessageReceived");
            reservationUpdated.stopListening("ReservationActivation");

            Echo.leave("parking-status");
            Echo.leave("parking-accepted");
            Echo.leave("mqtt-messages");
            Echo.leave("reservation");
        };
    }, []); // Solo se ejecuta una vez al montar el componente

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

            <Banner data={sensors} reservations={reservations} />

            <ContainerComponent
                data={sensors}
                user={auth.user}
                reservations={reservations}
                price={price.value}
            />

            {/* <pre>{JSON.stringify(price, undefined, 2)}</pre> */}
        </AuthenticatedLayout>
    );
}
