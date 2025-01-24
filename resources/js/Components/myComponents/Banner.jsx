import React from "react";

const Banner = ({ data, reservations }) => {
    const totalOccupied = data.filter((item) => item.occupied).length;

    const uniqueSensorIds = [
        ...new Set(reservations.map((reservation) => reservation.sensor_id)),
    ];
    const totalUniqueSensors = uniqueSensorIds.length;
    const totalFree = data.length - totalOccupied - totalUniqueSensors;

    return (
        <div className="flex flex-col items-center mt-2">
            {data.length > 0 && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md text-center mb-4">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        Total Estacionamientos: {data.length}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Ocupados: {totalOccupied} | Libres: {totalFree} |
                        Reservados: {totalUniqueSensors}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Banner;
