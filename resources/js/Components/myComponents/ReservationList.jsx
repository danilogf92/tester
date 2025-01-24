import React from "react";

const ReservationList = ({ reservations }) => {
    return (
        <div className="space-y-4 text-xs">
            {reservations?.map((reservation) => (
                <div
                    key={reservation.id}
                    className="p-4 border border-gray-300 rounded-md shadow-sm"
                >
                    <p className="text-lg font-semibold">
                        Reserva #{reservation.id}
                    </p>
                    <p>
                        <strong>Fecha:</strong> {reservation.date}
                    </p>
                    <p>
                        <strong>Hora:</strong> {reservation.time}
                    </p>
                    <p>
                        <strong>Tiempo de reserva: </strong>
                        {reservation.time_reservation} minutos
                        <span>
                            {" "}
                            <strong>{reservation.cost} $</strong>
                        </span>
                    </p>
                    <p>
                        <strong>Usuario #: </strong>
                        {reservation.user_id}
                    </p>
                </div>
            ))}

            {/* <pre>{JSON.stringify(reservations, undefined, 2)}</pre> */}
        </div>
    );
};

export default ReservationList;
