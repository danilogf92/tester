import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import ContainerComponent from "@/Components/ContainerComponent";

export default function Index({ auth, sensors: initialSensors }) {
  const [sensors, setSensors] = useState(initialSensors);

  useEffect(() => {
    // Configura un intervalo que se ejecuta cada segundo
    const interval = setInterval(() => {
      // Realiza una solicitud para obtener los datos más recientes
      fetch(route("sensors.index"), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Compara los sensores actuales con los nuevos datos
          const isEqual =
            JSON.stringify(sensors) === JSON.stringify(data.sensors);

          // Solo actualiza el estado si los datos son diferentes
          if (!isEqual) {
            console.log(data.sensors);
            setSensors(data.sensors);
          }
        })
        .catch((error) =>
          console.error("Error al actualizar los sensores:", error)
        );
    }, 1000); // 1000 ms = 1 segundo

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [sensors]); // Agrega 'sensors' como dependencia para que useEffect reconozca los cambios

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

      <ContainerComponent data={sensors} user={auth.user} />

      {/* <pre>{JSON.stringify(sensors, undefined, 2)}</pre> */}
    </AuthenticatedLayout>
  );
}
