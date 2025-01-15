import {
    ChartBarSquareIcon,
    ArrowTrendingUpIcon,
    ClipboardDocumentListIcon,
    CpuChipIcon,
} from "@heroicons/react/24/outline";
import { Link, Head } from "@inertiajs/react";

export default function Bienvenido({ auth }) {
    const manejarErrorImagen = () => {
        document.getElementById("contenedor-banner")?.classList.add("!hidden");
    };

    return (
        <>
            <Head title="Bienvenido al Parqueadero" />
            <div className="bg-blue-100 text-gray-800 dark:bg-gray-900 dark:text-white">
                <div className="relative min-h-screen flex flex-col items-center justify-center selection:bg-blue-600 selection:text-white">
                    <div className="w-full max-w-3xl px-6 lg:max-w-5xl">
                        <header className="grid grid-cols-2 items-center py-8 lg:grid-cols-3">
                            <div className="flex justify-center lg:col-start-2 ">
                                <img
                                    className="h-24 rounded-sm"
                                    src="/img/kradac.png"
                                    alt="Logo Empresa"
                                />
                            </div>
                            <nav className="flex justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="rounded-md px-4 py-2 text-gray-800 ring-1 ring-transparent hover:underline hover:text-gray-600 dark:text-white dark:hover:text-gray-400"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="rounded-md px-4 py-2 text-gray-800 ring-1 ring-transparent hover:underline hover:text-gray-600 dark:text-white dark:hover:text-gray-400"
                                        >
                                            Iniciar sesión
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="rounded-md px-4 py-2 text-gray-800 ring-1 ring-transparent hover:underline hover:text-gray-600 dark:text-white dark:hover:text-gray-400"
                                        >
                                            Registrarse
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-8">
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
                                    <div className="relative flex items-center justify-center">
                                        <img
                                            id="contenedor-banner"
                                            src="/img/iparking.png"
                                            alt="Banner Parqueadero"
                                            className="w-full rounded-md"
                                            onError={manejarErrorImagen}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                        <ChartBarSquareIcon className="w-10 text-blue-600" />
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                Monitoreo de Espacios
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Visualiza en tiempo real el
                                                estado de cada espacio: hora de
                                                ocupación, tiempo transcurrido y
                                                disponibilidad.
                                            </p>
                                        </div>
                                    </div>

                                    {/* <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                        <ArrowTrendingUpIcon className="w-10 text-green-600" />
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                Reportes
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Genera reportes de ingresos,
                                                tiempos de estancia y más.
                                            </p>
                                        </div>
                                    </div> */}

                                    <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                        <ClipboardDocumentListIcon className="w-10 text-yellow-600" />
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                Reservas
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Reserva tu espacio de
                                                estacionamiento con anticipación
                                                y garantiza tu lugar.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                        <CpuChipIcon className="w-10 text-purple-600" />
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                Disponibilidad
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Consulta en tiempo real el
                                                estado de los espacios de
                                                estacionamiento
                                                (libres/ocupados).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
