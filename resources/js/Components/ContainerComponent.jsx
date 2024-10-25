import React from "react";
import CarItem from "@/Components/CarItem";

const ContainerComponent = ({ data, user }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 mr-2 ml-2 mt-2">
      {data.map((item) => (
        <CarItem key={item.id} item={item} user={user} />
      ))}
    </div>
  );
};

export default ContainerComponent;
