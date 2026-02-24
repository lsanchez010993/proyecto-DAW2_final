import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditarLibro() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    sinopsis: "",
    precio_fisico: "",
    precio_digital: "",
    stock: 0,
    portada_url: "",
  });

  const [file, setFile] = useState(null);

  // 1. CARGAR DATOS AL INICIAR
  useEffect(() => {
    const fetchLibro = async () => {
      try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const res = await axios.get(`${URL}/api/libros/${id}`);
        const libro = res.data;

        // Extraer datos de la BD
        setFormData({
          titulo: libro.titulo,
          autor: libro.autor,
          isbn: libro.isbn || "",
          sinopsis: libro.sinopsis || "",
          precio_fisico: libro.precio?.fisico || 0,
          precio_digital: libro.precio?.digital || 0,
          stock: libro.stock || 0,
          portada_url: libro.portada_url || "",
        });
      } catch (error) {
        console.error(error);
        alert("Error al cargar el libro");
      }
    };
    fetchLibro();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 2. ENVIAR CAMBIOS (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      const data = new FormData();
      data.append("titulo", formData.titulo);
      data.append("autor", formData.autor);
      data.append("isbn", formData.isbn);
      data.append("sinopsis", formData.sinopsis);
      data.append("precio_fisico", formData.precio_fisico);
      data.append("precio_digital", formData.precio_digital);
      data.append("stock", formData.stock);

      // Solo añado una imagen si el usuario seleccionó la cambia
      if (file) {
        data.append("imagen", file);
      }

      const token = localStorage.getItem("token");

   
      await axios.put(`${URL}/api/libros/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("¡Libro actualizado correctamente!");
      navigate("/admin/libros"); 
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el libro");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="text-center mb-4">✏️ Editar Libro</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input
              type="text"
              name="titulo"
              className="form-control"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">ISBN</label>
            <input
              type="text"
              name="isbn"
              className="form-control"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Autor</label>
            <input
              type="text"
              name="autor"
              className="form-control"
              value={formData.autor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Precio Físico (€)</label>
              <input
                type="number"
                step="0.01"
                name="precio_fisico"
                className="form-control"
                value={formData.precio_fisico}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Precio Digital (€)</label>
              <input
                type="number"
                step="0.01"
                name="precio_digital"
                className="form-control"
                value={formData.precio_digital}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* STOCK */}
          <div className="mb-3">
            <label className="form-label">Stock (Unidades)</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          {/* PORTADA CON VISTA PREVIA */}
          <div className="mb-3">
            <label className="form-label">Portada (Imagen)</label>

            {/* Si ya hay imagen guardada, la mostramos pequeñita */}
            {formData.portada_url && !file && (
              <div className="mb-2">
                <img
                  src={formData.portada_url}
                  alt="Portada actual"
                  style={{ height: "100px", borderRadius: "5px" }}
                />
                <small className="d-block text-muted">Portada actual</small>
              </div>
            )}

            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="form-text">
              Deja esto vacío si quieres mantener la imagen actual.
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Sinopsis</label>
            <textarea
              name="sinopsis"
              className="form-control"
              rows="3"
              value={formData.sinopsis}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Actualizar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditarLibro;
