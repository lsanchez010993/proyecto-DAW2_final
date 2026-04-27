import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";


 export function useAfegirLibro() {
    const navigate = useNavigate();
    
    // Extraer usuario logueado
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
      editorial: "", 
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
    }
    return {
      loading,
      formData,
      setFormData,
      file,
      setFile,
      preview,
      setPreview,
      categoriasSeleccionadas,
      setCategoriasSeleccionadas,
      listaCategorias,
      handleChange,
      handleFileChange,
      toggleCategoria,
      handleSubmit,
    };
}