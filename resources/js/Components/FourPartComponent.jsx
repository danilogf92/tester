import React from "react";
import CarComponent from "./CarComponent";

const FourPartComponent = ({ data, onMessage, user }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 mr-2 ml-2 ">
      {Object.entries(data).map(([key, value]) => {
        if (key.startsWith("Parqueadero")) {
          return (
            <CarComponent
              user={user}
              onMessage={onMessage}
              key={key}
              name={key}
              status={value.ocupado}
              fechaInicio={value.FechaInicio}
              fechaFin={value.FechaFin}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default FourPartComponent;
