import React, { useEffect, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import InputError from "../InputError";

export const FormReservation = ({ sensors, user }) => {
    const { data, setData, post, errors } = useForm({
        user_id: user.id,
        sensor_id: "",
        date: "",
        time: "",
        time_reservation: "",
    });
    const [minTime, setMinTime] = useState("");
    const [minDate, setMinDate] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("reservations.store"), {
            onSuccess: (response) => {
                setData({
                    ...data,
                    sensor_id: "",
                    date: "",
                    time: "",
                    time_reservation: "",
                });
                console.log(response);
            },
            onError: (errors) => {},
        });
    };

    useEffect(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        now.setDate(now.getDate());

        setMinDate(now.toISOString().split("T")[0]);

        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        setMinTime(`${hours}:${minutes}`);
    }, []);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setData("date", selectedDate);

        const now = new Date();
        const todayDate = now.toISOString().split("T")[0];

        if (selectedDate === todayDate) {
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            setMinTime(`${hours}:${minutes}`);
        } else {
            setMinTime("00:00"); // Permitir todas las horas si no es hoy
        }
    };

    return (
        <div className="bg-gray-50 p-2 border rounded-lg">
            <form onSubmit={onSubmit}>
                <div className="space-y-12">
                    <div className="border-b border-white pb-6 text-center">
                        <h2 className="font-semibold leading-7 text-gray-900 text-xl">
                            Formulario de Reservación
                        </h2>
                    </div>

                    <div className="border-b border-white pb-6">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="sensor_id"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Parqueadero
                                </label>
                                <div className="mt-2">
                                    <select
                                        onChange={(e) =>
                                            setData("sensor_id", e.target.value)
                                        }
                                        value={data.sensor_id}
                                        id="sensor_id"
                                        name="sensor_id"
                                        autoComplete="sensor_id"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option value="" disabled>
                                            -- Seleccione el Parqueadero --
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
                                    <InputError
                                        message={errors.sensor_id}
                                        className="mt-2 text-red-500"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Fecha
                                </label>
                                <div className="mt-2">
                                    <input
                                        min={minDate}
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={data.date}
                                        onChange={handleDateChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                    <InputError
                                        message={errors.date}
                                        className="mt-2 text-red-500"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="time"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Hora
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="time"
                                        id="time"
                                        name="time"
                                        value={data.time}
                                        min={minTime}
                                        onChange={(e) =>
                                            setData("time", e.target.value)
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                    <InputError
                                        message={errors.time}
                                        className="mt-2 text-red-500"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="time_reservation"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Tiempo de reserva
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="time_reservation"
                                        name="time_reservation"
                                        value={data.time_reservation}
                                        onChange={(e) =>
                                            setData(
                                                "time_reservation",
                                                e.target.value
                                            )
                                        }
                                        autoComplete="time_reservation"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option value="" disabled>
                                            -- Seleccione Tiempo --
                                        </option>
                                        <option value="1">1</option>
                                        <option value="5">5</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                        <option value="60">60</option>
                                        <option value="75">75</option>
                                        <option value="90">90</option>
                                    </select>
                                    <InputError
                                        message={errors.time_reservation}
                                        className="mt-2 text-red-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-x-6">
                    <Link
                        href={route("reservations.index")}
                        className="rounded-md bg-amber-600 text-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                        Guardar
                    </button>
                </div>
            </form>
            {/* <pre>{JSON.stringify(data, undefined, 2)}</pre> */}
        </div>
    );
};
