import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from 'react-hot-toast';
import styles from "./css/EditarPerfil.module.css";

function EditarPerfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const [pestañaActiva, setPestañaActiva] = useState("datos");

  // Estados del perfil
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [preferencias, setPreferencias] = useState([]);
  const [direccion, setDireccion] = useState({
    calle: "", ciudad: "", codigo_postal: "", pais: "", telefono: ""
  });

  // Estados Modal
  const [showModal, setShowModal] = useState(false);
  const [passData, setPassData] = useState({ actual: "", nueva: "", confirmar: "" });

  const opcionesPreferencias = [
    "Ciencia Ficción", "Fantasía", "Misterio y Thriller", "Romance", "Terror",
    "Novela Histórica", "Biografía", "Desarrollo Personal", "Poesía",
    "Cómic y Manga", "Clásicos", "Aventura"
  ];

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || "");
      setApellidos(usuario.apellidos || "");
      setEmail(usuario.email || "");
      setPreferencias(usuario.gustos_literarios || []);
      if (usuario.direccion) {
        setDireccion({
          calle: usuario.direccion.calle || "",
          ciudad: usuario.direccion.ciudad || "",
          codigo_postal: usuario.direccion.codigo_postal || "",
          pais: usuario.direccion.pais || "",
          telefono: usuario.direccion.telefono || ""
        });
      }
    }
  }, [usuario]);

  const togglePreferencia = (genero) => {
    preferencias.includes(genero)
      ? setPreferencias(preferencias.filter((item) => item !== genero))
      : setPreferencias([...preferencias, genero]);
  };

  const handleDireccionChange = (e) => {
    setDireccion({ ...direccion, [e.target.name]: e.target.value });
  };

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${URL}/api/usuarios/perfil`,
        { nombre, apellidos, email, preferencias, direccion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      actualizarUsuario(res.data);
      toast.success("¡Perfil y dirección actualizados!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al guardar");
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (passData.nueva !== passData.confirmar) {
      return toast.error("La nueva contraseña y la confirmación no coinciden");
    }
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = localStorage.getItem("token");
      await axios.put(`${URL}/api/usuarios/cambiar-password`, passData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("¡Contraseña actualizada!");
      setShowModal(false);
      setPassData({ actual: "", nueva: "", confirmar: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al cambiar contraseña");
    }
  };

  return (
    <>
      <div className="container mt-5 mb-5 d-flex justify-content-center">
        <div className={`card shadow-sm border-0 ${styles.tarjetaPerfil}`}>
          <div className="card-header bg-white border-0 pt-4 pb-0">
            <h2 className="display-6 text-center mb-4 fw-bold">Mi perfil</h2>

            <div className={styles.contenedorPestanas}>
              <ul className="nav nav-pills nav-fill border-0">
                <li className="nav-item">
                  <button
                    className={`nav-link ${styles.botonPestana} ${pestañaActiva === "datos" ? styles.pestanaActiva : styles.pestanaInactiva}`}
                    onClick={() => setPestañaActiva("datos")}
                  >
                    👤 Mis Datos
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${styles.botonPestana} ${pestañaActiva === "envio" ? styles.pestanaActiva : styles.pestanaInactiva}`}
                    onClick={() => setPestañaActiva("envio")}
                  >
                    🚚 Envío
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {pestañaActiva === "datos" && (
                <div className="animate__animated animate__fadeIn">
                  <h4 className="mb-4 text-center">Información Personal</h4>
                  <div className="mb-3">
                    <label className="small text-muted">Nombre</label>
                    <input type="text" className="form-control rounded-pill" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="small text-muted">Apellidos</label>
                    <input type="text" className="form-control rounded-pill" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <label className="small text-muted">Email</label>
                    <input type="email" className="form-control rounded-pill" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="text-end mb-3">
                    <button type="button" className="btn btn-link text-decoration-none p-0 small fw-bold text-primary" onClick={() => setShowModal(true)}>
                      Cambiar contraseña
                    </button>
                  </div>

                  <hr />
                  <h5 className="text-center my-3">Preferencias literarias</h5>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {opcionesPreferencias.map((g) => (
                      <button
                        key={g} type="button" onClick={() => togglePreferencia(g)}
                        className={`btn btn-sm rounded-pill ${styles.preferenciaBtn} ${preferencias.includes(g) ? "btn-primary" : "btn-outline-secondary"}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pestañaActiva === "envio" && (
                <div className="animate__animated animate__fadeIn">
                  <h4 className="mb-4 text-center">Dirección de Entrega</h4>
                  <div className="mb-3">
                    <label className="small text-muted">Calle y número</label>
                    <input type="text" name="calle" className="form-control rounded-pill" value={direccion.calle} onChange={handleDireccionChange} placeholder="Ej: Calle Mayor 12, 2B" />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="small text-muted">Ciudad</label>
                      <input type="text" name="ciudad" className="form-control rounded-pill" value={direccion.ciudad} onChange={handleDireccionChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="small text-muted">Código Postal</label>
                      <input type="text" name="codigo_postal" className="form-control rounded-pill" value={direccion.codigo_postal} onChange={handleDireccionChange} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="small text-muted">País</label>
                    <input type="text" name="pais" className="form-control rounded-pill" value={direccion.pais} onChange={handleDireccionChange} />
                  </div>
                  <div className="mb-3">
                    <label className="small text-muted">Teléfono de contacto</label>
                    <input type="text" name="telefono" className="form-control rounded-pill" value={direccion.telefono} onChange={handleDireccionChange} />
                  </div>
                </div>
              )}

              <div className="d-grid mt-5">
                <button type="submit" className="btn btn-dark rounded-pill py-2 fw-bold shadow">
                  Guardar todos los cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={`modal fade show d-block ${styles.modalOverlay}`}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Actualizar Contraseña</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={submitPassword}>
                <div className="modal-body py-4">
                  <div className="mb-3">
                    <label className="small text-muted mb-1">Contraseña Actual</label>
                    <input type="password" name="actual" className="form-control rounded-pill" required value={passData.actual} onChange={handlePassChange} />
                  </div>
                  <div className="mb-3">
                    <label className="small text-muted mb-1">Nueva Contraseña</label>
                    <input type="password" name="nueva" className="form-control rounded-pill" required value={passData.nueva} onChange={handlePassChange} />
                  </div>
                  <div className="mb-0">
                    <label className="small text-muted mb-1">Confirmar Nueva Contraseña</label>
                    <input type="password" name="confirmar" className="form-control rounded-pill" required value={passData.confirmar} onChange={handlePassChange} />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-dark rounded-pill px-4 shadow-sm">Guardar Nueva Clave</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditarPerfil;
