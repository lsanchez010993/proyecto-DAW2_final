import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./css/CrearLibro.module.css";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function CrearLibro() {
  const navigate = useNavigate();
  
  // 2. Extraemos el usuario logueado
  const { usuario } = useAuth(); 

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    sinopsis: "",
    precio_fisico: "",
    precio_digital: "",
    stock: 10,
    editorial: "", // Lo volvemos a añadir aquí
  });
  useEffect(() => {
    if (usuario && usuario.nombre_editorial) {
      setFormData((prevData) => ({
        ...prevData,
        editorial: usuario.nombre_editorial
      }));
    }
  }, [usuario]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const listaCategorias = [
    "Ciencia Ficción",
    "Fantasía",
    "Misterio y Thriller",
    "Romance",
    "Terror",
    "Novela Histórica",
    "Biografía",
    "Desarrollo Personal",
    "Poesía",
    "Cómic y Manga",
    "Clásicos",
    "Aventura",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const toggleCategoria = (cat) => {
    if (categoriasSeleccionadas.includes(cat)) {
      setCategoriasSeleccionadas(
        categoriasSeleccionadas.filter((c) => c !== cat),
      );
    } else {
      setCategoriasSeleccionadas([...categoriasSeleccionadas, cat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoriasSeleccionadas.length === 0) {
      return toast.error("Por favor, selecciona al menos una categoría.");
    }

    setLoading(true);

    const peticion = async () => {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const data = new FormData();

      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (file) data.append("imagen", file);

      data.append("categorias", JSON.stringify(categoriasSeleccionadas));

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      return axios.post(`${URL}/api/libros`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };

    toast.promise(peticion(), {
      loading: "Subiendo libro...",
      success: () => {
        setLoading(false);
        navigate("/");
        return "¡Libro creado con éxito!";
      },
      error: (err) => {
        setLoading(false);
        return err.response?.data?.message || "Error al crear el libro";
      },
    });
  };

  return (
    <div className="container mt-5">
      <div className={`card shadow p-4 ${styles.tarjetaCrear}`}>
        <h2 className="text-center mb-4 fw-bold">📚 Añadir Nuevo Libro</h2>
        <form onSubmit={handleSubmit}>
          {preview && (
            <div className="text-center mb-4 animate__animated animate__zoomIn">
              <p className="small text-muted mb-2">
                Vista previa de la portada:
              </p>
              <img
                src={preview}
                alt="Vista previa"
                className={styles.imagenPreview}
              />
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger rounded-pill"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  Quitar imagen
                </button>
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="small text-muted mb-1">Título</label>
            <input
              type="text"
              name="titulo"
              className={`form-control ${styles.inputRedondeado}`}
              required
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="small text-muted mb-1">ISBN</label>
              <input
                type="text"
                name="isbn"
                className={`form-control ${styles.inputRedondeado}`}
                required
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="small text-muted mb-1">Autor</label>
              <input
                type="text"
                name="autor"
                className={`form-control ${styles.inputRedondeado}`}
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="small text-muted mb-1">Editorial</label>
            <input
              type="text"
              name="editorial"
              className={`form-control ${styles.inputRedondeado} bg-light`}
              value={formData.editorial}
              readOnly // Evita que lo modifiquen
              placeholder="Cargando tu editorial..."
            />
            <small className="text-muted ms-2" style={{ fontSize: "0.75rem" }}>
              * Este campo se asigna automáticamente según tu perfil.
            </small>
          </div>
        
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="small text-muted mb-1">Precio Físico (€)</label>
              <input
                type="number"
                step="0.01"
                name="precio_fisico"
                className={`form-control ${styles.inputRedondeado}`}
                required
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="small text-muted mb-1">
                Precio Digital (€)
              </label>
              <input
                type="number"
                step="0.01"
                name="precio_digital"
                className={`form-control ${styles.inputRedondeado}`}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/*Interfaz visual de categorías */}
          <div className="mb-4">
            <label className="small text-muted mb-2 d-block">
              Categorías del libro (Selecciona una o varias)
            </label>
            <div className="d-flex flex-wrap gap-2">
              {listaCategorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategoria(cat)}
                  className={`btn btn-sm rounded-pill ${styles.categoriaBtn} ${
                    categoriasSeleccionadas.includes(cat)
                      ? "btn-dark"
                      : "btn-outline-secondary"
                  }`}
                >
                  {categoriasSeleccionadas.includes(cat) && "✓ "} {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="small text-muted mb-1">Subir Portada</label>
            <input
              type="file"
              className={`form-control ${styles.inputRedondeado}`}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="mb-4">
            <label className="small text-muted mb-1">Sinopsis</label>
            <textarea
              name="sinopsis"
              className={`form-control ${styles.areaTexto}`}
              rows="3"
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 rounded-pill fw-bold py-2 shadow"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Libro"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CrearLibro;
