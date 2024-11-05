import React from "react";

const ContainerAuth = ({ children }) => {
    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg shadow-red-300">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContainerAuth;
