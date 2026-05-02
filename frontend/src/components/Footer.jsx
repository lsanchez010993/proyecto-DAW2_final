import React from 'react';
import styles from './css/Footer.module.css';
import { Link } from 'react-router-dom';
import imagenFondo from '../assets/libros-nav.png';

function Footer() {
  return (

    <footer 
      className={styles.footerContainer} 
      style={{ backgroundImage: `url(${imagenFondo})` }}
    >
      {/* Oscurecer el fondo */}
      <div className={styles.capaOscura}></div>

      {/* Contenedor principal del texto */}
      <div className={`container py-5 ${styles.contenido}`}>

        <div className="row">
          
          {/* Columna 1: Sobre nosotros */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3 text-white">📚 QuéDeLibros</h5>
            <p className="text-light" style={{ fontSize: "0.9rem" }}>
              Tu refugio literario digital. Descubre, lee y sumérgete en miles de historias. 
              Apoyando tanto a grandes editoriales como a autores independientes.
            </p>
          </div>

          {/* Columna 2: Ayuda y Enlaces rápidos */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3 text-white">Ayuda al Lector</h5>
            <ul className="list-unstyled" style={{ fontSize: "0.9rem" }}>
              <li className="mb-2">
                <Link to="/ayuda" className={styles.enlace}>Preguntas Frecuentes</Link>
              </li>
              <li className="mb-2">
                <Link to="/envios" className={styles.enlace}>Política de Envíos</Link>
              </li>
              <li className="mb-2">
                <Link to="/terminos" className={styles.enlace}>Términos y Condiciones</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3 text-white">Contacto</h5>
            <ul className="list-unstyled text-light" style={{ fontSize: "0.9rem" }}>
              <li className="mb-2">+34 900 123 456</li>
              <li className="mb-2">soporte@quedelibros.com</li>
              <li className="mb-2">Calle de las Letras, 42, Madrid</li>
            </ul>
            
           
            <button className="btn btn-outline-light btn-sm mt-2 rounded-pill px-4">
              Escríbenos
            </button>
          </div>

        </div>

        {/* Línea inferior de Copyright */}
        <div className="row mt-4 pt-3 border-top border-secondary">
          <div className="col-12 text-center">
            <p className="mb-0 text-white-50" style={{ fontSize: "0.8rem" }}>
              &copy; {new Date().getFullYear()} QuéDeLibros. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;