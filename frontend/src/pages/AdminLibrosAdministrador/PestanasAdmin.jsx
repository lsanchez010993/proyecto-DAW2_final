// frontend/src/components/PestanasAdmin.jsx
import styles from "./AdminLibros.module.css";

export default function PestanasAdmin({ pestañaActiva, onCambiarPestaña }) {
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
                📦 Libros
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
                📚 Libros gratuitos
              </button>
            </li>
          </ul>
    </div>
  );
}