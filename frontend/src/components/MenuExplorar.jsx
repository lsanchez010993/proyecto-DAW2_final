import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './css/MenuExplorar.module.css';

function MenuExplorar() {
  const location = useLocation();

  // 1. Que el menú sea visible en las siguientes rutas
  const rutasPermitidas = ['/categorias', '/autores', '/editoriales', '/recomendados'];

  // 2. Comprobamos ruta actual
  const esVisible = rutasPermitidas.some(ruta => location.pathname.startsWith(ruta));


  if (!esVisible) return null;

  return (
    <div className={`animate__animated animate__fadeInDown ${styles.contenedorCentrado}`}>
      <div className={styles.menuPildora}>
        
        <NavLink 
          to="/categorias" 
          className={({ isActive }) => isActive ? `${styles.enlaceItem} ${styles.enlaceActivo}` : styles.enlaceItem}
        >
          Categorías
        </NavLink>

        <NavLink 
          to="/autores" 
          className={({ isActive }) => isActive ? `${styles.enlaceItem} ${styles.enlaceActivo}` : styles.enlaceItem}
        >
          Autores
        </NavLink>

        <NavLink 
          to="/editoriales" 
          className={({ isActive }) => isActive ? `${styles.enlaceItem} ${styles.enlaceActivo}` : styles.enlaceItem}
        >
          Editoriales
        </NavLink>

        <NavLink 
          to="/recomendados" 
          className={({ isActive }) => isActive ? `${styles.enlaceItem} ${styles.enlaceActivo}` : styles.enlaceItem}
        >
          Recomendados
        </NavLink>

      </div>
    </div>
  );
}

export default MenuExplorar;