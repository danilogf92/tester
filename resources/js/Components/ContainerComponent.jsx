import React from "react";
import CarItem from "@/Components/CarItem";

const ContainerComponent = ({ data, user, reservations, price }) => {
    return (
        <div className="flex flex-col items-center ">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 w-full max-w-3xl">
                {data.map((item) => (
                    <CarItem
                        key={item.id}
                        item={item}
                        user={user}
                        reservations={reservations}
                        price={price}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContainerComponent;
