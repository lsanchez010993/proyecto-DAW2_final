import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./css/MenuExplorar.module.css";

function MenuExplorar() {
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
      </div>
    </div>
  );
}

export default MenuExplorar;
