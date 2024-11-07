import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Verificación de correo electrónico" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                ¡Gracias por registrarte! Antes de comenzar, ¿podrías verificar
                tu dirección de correo electrónico haciendo clic en el enlace
                que acabamos de enviarte por correo? Si no recibiste el correo,
                con gusto te enviaremos otro.
            </div>

            {status === "verification-link-sent" && (
                <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                    Se ha enviado un nuevo enlace de verificación a la dirección
                    de correo electrónico que proporcionaste durante el
                    registro.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Reenviar correo de verificación
                    </PrimaryButton>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Cerrar sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
