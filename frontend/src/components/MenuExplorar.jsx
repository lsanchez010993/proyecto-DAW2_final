import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./css/MenuExplorar.module.css";

function MenuExplorar() {
  const location = useLocation();

  // Rutas donde no se muestra el menú explorar
  const rutasOcultas = [
    "/login",
    "/registro",
    "/perfil",
    "/admin/usuarios",
    "/admin/libros",
    "/editorial/libros",
    "/afegirLibro",
    "/carrito",
    "/admin/compras",
    "/admin/descargas",
    "/historial/compras",
    "/historial/descargas"
  ];

  // Comprobar si la ruta actual empieza por alguna de las rutas ocultas 
  const ocultarMenu = rutasOcultas.includes(location.pathname) || location.pathname.startsWith("/editar-libro/");

  if (ocultarMenu) {
    return null; // No renderiza nada si está en una ruta oculta
  }

  return (
    <div
      className={`animate__animated animate__fadeInDown ${styles.contenedorCentrado}`}
    >
      <div className={styles.menuPildora}>
        <NavLink
          to="/categorias"
          className={({ isActive }) =>
            isActive
              ? `${styles.enlaceItem} ${styles.enlaceActivo}`
              : styles.enlaceItem
          }
        >
          Categorías
        </NavLink>

        <NavLink
          to="/editoriales"
          className={({ isActive }) =>
            isActive
              ? `${styles.enlaceItem} ${styles.enlaceActivo}`
              : styles.enlaceItem
          }
        >
          Editoriales
        </NavLink>

        <NavLink
          to="/autores"
          className={({ isActive }) =>
            isActive
              ? `${styles.enlaceItem} ${styles.enlaceActivo}`
              : styles.enlaceItem
          }
        >
          Autores
        </NavLink>
        <NavLink
          to="/libros"
          className={({ isActive }) =>
            isActive
              ? `${styles.enlaceItem} ${styles.enlaceActivo}`
              : styles.enlaceItem
          }
        >
          Libros
        </NavLink>
      </div>
    </div>
  );
}

export default MenuExplorar;
