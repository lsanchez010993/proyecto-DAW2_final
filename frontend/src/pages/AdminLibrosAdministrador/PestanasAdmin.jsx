// frontend/src/components/PestanasAdmin.jsx
import styles from "./AdminLibros.module.css";
import { APP_MESSAGES } from "../../constants/messages";

export default function PestanasAdmin({ pestañaActiva, onCambiarPestaña }) {
  const M = APP_MESSAGES.PAGES.ADMIN_LIBROS;
  return (
    <div className={`mb-3 ${styles.contenedorPestanas}`}>
       <ul className="nav nav-pills nav-fill border-0">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${styles.botonPestana} ${
                  pestañaActiva === "catalogo"
                    ? styles.pestanaActiva
                    : styles.pestanaInactiva
                }`}
                onClick={() => onCambiarPestaña("catalogo")}
              >
                {M.PESTANA_LIBROS}
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${styles.botonPestana} ${
                  pestañaActiva === "gratuitos"
                    ? styles.pestanaActiva
                    : styles.pestanaInactiva
                }`}
                onClick={() => onCambiarPestaña("gratuitos")}
              >
                {M.PESTANA_GRATUITOS}
              </button>
            </li>
          </ul>
    </div>
  );
}