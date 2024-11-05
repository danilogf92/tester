import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import { Link } from "@inertiajs/react";
import React from "react";

export default function Container({ route, buttonText, children }) {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg ">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="py-5">
                            <Link
                                href={route}
                                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                                <ArrowLongLeftIcon className="h-6 w-6 text-white mr-2" />
                                {buttonText}
                            </Link>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
