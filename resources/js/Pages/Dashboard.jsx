import MQTTConnection from "@/Components/MQTTConnection";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ auth }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <MQTTConnection user={auth.user} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
