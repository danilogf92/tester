import { NoContent } from "@/Components/myComponents/NoContent";
import Pagination from "@/Components/myComponents/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Modal from "@/Components/Modal";

export default function Index({
    auth,
    sensors,
    reservations,
    queryParams = null,
}) {
    queryParams = queryParams || {};
    const [filters, setFilters] = useState({
        date: queryParams.date || "",
        sensor_id: queryParams.sensor_id || "",
        rows: queryParams.rows || 5,
    });
    const [forceRender, setForceRender] = useState(false);
    const [reservationsData, setReservationsData] = useState(reservations.data);

    const deleteReservation = (reservation) => {
        router.delete(route("reservations.destroy", reservation.id), {
            onSuccess: (response) => {
                // console.log(response); // AQUI GENERA EL showSuccess
            },
            onError: (errors) => {
                // console.log(errors);
            },
        });
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);

    const onDeleteReservation = () => {
        if (!reservationToDelete) return;

        deleteReservation(reservationToDelete);
        setIsDeleteModalOpen(false);
    };

    const clearFilter = () => {
        setFilters({
            date: "",
            sensor_id: "",
            rows: 5,
        });

        // Hacer la solicitud a la ruta de índice de medidas usando los filtros actualizados
        router.get(route("reservations.index"));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        // Actualizar el estado local de los filtros
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));

        // Hacer la solicitud a la ruta de índice de medidas usando los filtros actualizados
        router.get(
            route("reservations.index"),
            {
                ...filters,
                [name]: value, // Actualiza el filtro específico que cambió
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    useEffect(() => {
        const reservationUpdated = Echo.channel("reservation").listen(
            "ReservationActivation",
            (event) => {
                setReservationsData((prevReservations) => {
                    return prevReservations.map((reservation) => {
                        if (reservation.id === event.reservation.id) {
                            return {
                                ...reservation,
                                status: event.reservation.status,
                            };
                        }
                        return reservation;
                    });
                });
            }
        );

        return () => {
            Echo.leave("reservation");
        };
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Reservaciones
                    </h2>

                    <Link
                        href={route("reservations.create")}
                        className="bg-emerald-500 py-2 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                    >
                        Crear reservación
                    </Link>
                </div>
            }
        >
            <Head title="Reservaciones" />
            <div className="py-8">
                {/* <div className="max-w-7xl mx-auto sm:px-6 lg:px-8"> */}
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg mr-2">
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-2 bg-white m-2">
                            {/* Filter Form */}
                            <div className="mb-4 grid grid-cols-1 justify-items-center">
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-2 ">
                                    <div className="col-span-1">
                                        <label
                                            htmlFor="date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Fecha
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            id="date"
                                            value={queryParams.date}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label
                                            htmlFor="sensor_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            sensor
                                        </label>
                                        <select
                                            name="sensor_id"
                                            id="sensor_id"
                                            value={queryParams.sensor_id}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">
                                                Select sensor
                                            </option>
                                            {sensors.map((sensor) => (
                                                <option
                                                    key={sensor.id}
                                                    value={sensor.id}
                                                >
                                                    {sensor.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-1">
                                        <label
                                            htmlFor="rows"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Filas
                                        </label>
                                        <select
                                            name="rows"
                                            id="rows"
                                            value={queryParams.rows}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            {/* <option value="all">All</option> */}
                                        </select>
                                    </div>
                                    <div className="col-span-1 flex items-end space-x-2">
                                        <button
                                            onClick={clearFilter}
                                            className="w-full bg-red-400 text-white py-2 px-4 rounded shadow"
                                        >
                                            Borrar Filtros
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {reservationsData.length > 0 && (
                                <>
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-red-50 rounded-lg">
                                        <thead className="text-xs text-gray-700 uppercase  dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500 rounded-lg">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Id
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Parqueadero
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Usuario
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Estado
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Fecha
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Hora
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Tiempo de reserva min
                                                </th>

                                                <th
                                                    scope="col"
                                                    className="px-6 py-3"
                                                >
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {reservationsData.map(
                                                (reservations, index) => (
                                                    <tr
                                                        key={reservations.id}
                                                        className={`${
                                                            index % 2 === 0
                                                                ? "bg-white"
                                                                : "bg-gray-100"
                                                        } border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                                                    >
                                                        <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {reservations.id}
                                                        </td>
                                                        <td className="px-6 py-2">
                                                            {
                                                                reservations.reservation_parking
                                                            }
                                                        </td>
                                                        <td className="px-6 py-2">
                                                            {
                                                                reservations.user_name
                                                            }
                                                        </td>
                                                        <td
                                                            className={`px-6 py-2 ${
                                                                reservations.status ===
                                                                "pendiente"
                                                                    ? "bg-yellow-200"
                                                                    : reservations.status ===
                                                                      "activa"
                                                                    ? "bg-green-200"
                                                                    : reservations.status ===
                                                                      "inactiva"
                                                                    ? "bg-rose-200"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {
                                                                reservations.status
                                                            }
                                                        </td>

                                                        <td className="px-6 py-2">
                                                            {
                                                                reservations.reservation_date
                                                            }
                                                        </td>
                                                        <td className="px-6 py-2">
                                                            {
                                                                reservations.reservation_time
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                reservations.reservation_duration
                                                            }
                                                        </td>

                                                        <td className="py-2 text-center">
                                                            {/* <Link
                                                                className="font-medium text-amber-600 dark:text-amber-500 hover:underline mr-4"
                                                                href={route(
                                                                    "reservations.edit",
                                                                    reservations.id
                                                                )}
                                                            >
                                                                Edit
                                                            </Link> */}
                                                            <button
                                                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                                                onClick={() => {
                                                                    setReservationToDelete(
                                                                        reservations
                                                                    );
                                                                    setIsDeleteModalOpen(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>

                                    <Modal
                                        show={isDeleteModalOpen}
                                        onClose={() =>
                                            setIsDeleteModalOpen(false)
                                        }
                                        maxWidth="sm"
                                    >
                                        <div className="p-6 bg-slate-500 text-white">
                                            <h2 className="text-lg font-semibold mb-4">
                                                Desea Borrar su reservacion
                                            </h2>
                                            <p className="text-sm text-white mb-8">
                                                ¿Estás seguro de que deseas
                                                eliminar esta reserva? Esta
                                                acción no se puede deshacer.
                                            </p>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={
                                                        onDeleteReservation
                                                    }
                                                    className="bg-red-500 text-white rounded-md px-4 py-2 mr-2 hover:bg-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setIsDeleteModalOpen(
                                                            false
                                                        )
                                                    }
                                                    className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </Modal>
                                    <Pagination
                                        links={reservations.meta.links}
                                        filters={filters}
                                    />
                                </>
                            )}
                            {reservations.data.length === 0 && (
                                <NoContent
                                    text={"No existen reservaciones"}
                                    icon={"🛢"}
                                />
                            )}
                        </div>
                        {/* <pre>
                            {JSON.stringify(reservations.data, undefined, 2)}
                        </pre>
                        <pre>
                            {JSON.stringify(reservationsData, undefined, 2)}
                        </pre>*/}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
