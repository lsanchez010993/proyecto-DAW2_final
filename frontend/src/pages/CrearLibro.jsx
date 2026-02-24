import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CrearLibro() {
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    isbn: '', 
    sinopsis: '',
    precio_fisico: '',
    precio_digital: '',
    stock: 10
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      
      const data = new FormData();
      data.append('titulo', formData.titulo);
      data.append('autor', formData.autor);
      data.append('isbn', formData.isbn); 
      data.append('sinopsis', formData.sinopsis);
      data.append('precio_fisico', formData.precio_fisico);
      data.append('precio_digital', formData.precio_digital);
      data.append('stock', formData.stock);

      if (file) {
        data.append('imagen', file);
      }

      const token = localStorage.getItem('token'); 

      await axios.post(`${URL}/api/libros`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('¡Libro creado con éxito!');
      navigate('/'); 

    } catch (error) {
      console.error(error);
      
      alert(error.response?.data?.message || 'Error al crear el libro');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4">📚 Añadir Nuevo Libro</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input type="text" name="titulo" className="form-control" required onChange={handleChange} />
          </div>

         
          <div className="mb-3">
            <label className="form-label">ISBN (Identificador Único)</label>
            <input 
                type="text" 
                name="isbn" 
                className="form-control" 
                placeholder="Ej: 978-3-16-148410-0"
                required 
                onChange={handleChange} 
            />
          </div>
      

          <div className="mb-3">
            <label className="form-label">Autor</label>
            <input type="text" name="autor" className="form-control" required onChange={handleChange} />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Precio Físico (€)</label>
              <input type="number" step="0.01" name="precio_fisico" className="form-control" required onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Precio Digital (€)</label>
              <input type="number" step="0.01" name="precio_digital" className="form-control" required onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Subir Portada (Imagen)</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Sinopsis</label>
            <textarea name="sinopsis" className="form-control" rows="3" onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold">Guardar Libro</button>
          
        </form>
      </div>
    </div>
  );
}

export default CrearLibro;