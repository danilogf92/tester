import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ContainerComponent from "@/Components/ContainerComponent";

export default function Index({ auth, sensors: initialSensors }) {
  const [sensors, setSensors] = useState(initialSensors);

  const handleParkingStatusUpdate = (event) => {
    console.log("Estado del estacionamiento actualizado:", event);

    // Actualiza el estado de los sensores
    setSensors((prevSensors) => {
      return prevSensors.map((sensor) => {
        // Verifica si el sensor necesita ser actualizado
        if (sensor.id === event.parkingId) {
          // Devuelve una copia del sensor con el nuevo estado `occupied`
          return { ...sensor, occupied: event.occupied }; // Actualiza el atributo `occupied`
        }
        return sensor; // Retorna el sensor sin cambios
      });
    });
  };

  useEffect(() => {
    const parkingStatusListener = Echo.private("parking-status").listen(
      "ParkingStatusUpdated",
      (event) => {
        handleParkingStatusUpdate(event); // Llama a la función aquí
      }
    );
  }, []);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Sensores
        </h2>
      }
    >
      <Head title="Sensores" />

      {/* ContainerComponent se re-renderizará automáticamente cuando `sensors` cambie */}
      <ContainerComponent data={sensors} user={auth.user} />

      <pre>{JSON.stringify(sensors, undefined, 2)}</pre>
    </AuthenticatedLayout>
  );
}
