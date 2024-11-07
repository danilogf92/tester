import React from "react";
import CarItem from "@/Components/CarItem";

const ContainerComponent = ({ data, user }) => {
    // Calcular el total de estacionamientos ocupados y libres
    const totalOccupied = data.filter((item) => item.occupied).length;
    const totalFree = data.length - totalOccupied;

    return (
        <div className="flex flex-col items-center mt-4">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md text-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    Total Estacionamientos: {data.length}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Ocupados: {totalOccupied} | Libres: {totalFree}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 w-full max-w-3xl">
                {data.map((item) => (
                    <CarItem key={item.id} item={item} user={user} />
                ))}
            </div>
        </div>
    );
};

export default ContainerComponent;
