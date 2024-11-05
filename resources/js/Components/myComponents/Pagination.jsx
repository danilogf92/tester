// import { Link } from "@inertiajs/react";

// export default function Pagination({ links }) {
//   return (
//     <nav className="text-center mt-4">
//       {links.map((link) => (
//         <Link
//           preserveScroll
//           href={link.url || ""}
//           key={link.label}
//           className={
//             "inline-block py-2 px-3 rounded-lg text-gray-200 text-xs " +
//             (link.active ? "bg-gray-950 " : " ") +
//             (!link.url
//               ? "!text-gray-500 cursor-not-allowed "
//               : "hover:bg-gray-950")
//           }
//           dangerouslySetInnerHTML={{ __html: link.label }}
//         ></Link>
//       ))}
//     </nav>
//   );
// }

import { Link } from "@inertiajs/react";

export default function Pagination({ links, filters }) {
  return (
    <nav className="text-center mt-4">
      {links.map((link) => {
        let href = link.url || "";

        // Agregar parámetros de filtro a la URL de paginación si hay filtros definidos
        if (Object.keys(filters).length > 0) {
          const params = new URLSearchParams(filters);
          href += href.includes("?") ? "&" : "?";
          href += params.toString();
        }

        return (
          <Link
            preserveScroll
            href={href}
            key={link.label}
            className={
              "inline-block py-2 px-3 rounded-lg text-gray-200 text-xs " +
              (link.active ? "bg-gray-950 " : " ") +
              (!link.url
                ? "!text-gray-500 cursor-not-allowed "
                : "hover:bg-gray-950")
            }
            dangerouslySetInnerHTML={{ __html: link.label }}
          ></Link>
        );
      })}
    </nav>
  );
}
