import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import Container from "@/Components/myComponents/Container";
import { FormReservation } from "@/Components/myComponents/FormReservation";

export default function Create({ auth, sensors }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Nueva Reservación
                </h2>
            }
        >
            <Head title="Reservations" />
            <Container
                route={route("reservations.index")}
                buttonText="Regresar"
            >
                <FormReservation sensors={sensors} user={auth.user} />
            </Container>
        </AuthenticatedLayout>
    );
}
