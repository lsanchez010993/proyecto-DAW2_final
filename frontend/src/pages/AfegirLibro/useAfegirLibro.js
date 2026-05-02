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
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    tipo: null,
    datos: null,
  });
  const esEditor = usuario?.rol === "editorial";
  const esAdmin = usuario?.rol === "admin";
  const [editoriales, setEditoriales] = useState([]);
  useEffect(() => {
    if (esAdmin) {
      //Si es admin me debe devolver una lista con todas las editoriales a fin de poder asignar el libro creaddo a una editorial
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const peticion = async () => {
        const res = await axios.get(`${URL}/api/libros/editoriales/unicas`);
        const lista = Array.isArray(res.data) ? res.data : [];
        setEditoriales(lista);

        // Valor por defecto si aún no se ha elegido editorial
        setFormData((prev) => {
          if (!prev.editorial && lista.length > 0) return { ...prev, editorial: lista[0] };
          return prev;
        });
      };
      peticion();
    }
  }, [esAdmin]);
  useEffect(() => {
    if (esEditor) {
      setFormData((prevData) => ({
        ...prevData,
        editorial: usuario.nombre_editorial,
      }));
    }
  }, [esEditor, usuario?.nombre_editorial]);
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return URL.createObjectURL(selectedFile);
      });
    }
  };

  const toggleCategoria = (cat) => {
    if (categoriasSeleccionadas.includes(cat)) {
      setCategoriasSeleccionadas(categoriasSeleccionadas.filter((c) => c !== cat));
    } else {
      setCategoriasSeleccionadas([...categoriasSeleccionadas, cat]);
    }
  };

  async function afegirLlibreEnServidor() {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const data = new FormData();

      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (file) data.append("imagen", file);

      data.append("categorias", JSON.stringify(categoriasSeleccionadas));

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post(`${URL}/api/libros`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("¡Libro creado con éxito!");
      navigate("/");
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al crear el libro");
      return false;
    }
  }

  function cerrarModal() {
    setModalConfig({ isOpen: false, tipo: null, datos: null });
  }

  function abrirModalCreacionLibro() {
    setModalConfig({
      isOpen: true,
      tipo: "AFEGIR",
      datos: null,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categoriasSeleccionadas.length === 0) {
      return toast.error("Por favor, selecciona al menos una categoría.");
    }
    abrirModalCreacionLibro();
  };

  async function confirmarModal() {
    setLoading(true);
    try {
      const ok = await afegirLlibreEnServidor();
      if (ok) cerrarModal();
    } finally {
      setLoading(false);
    }
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
    esEditor,
    esAdmin,
    editoriales,
    modalConfig,
    cerrarModal,
    confirmarModal,
  };
}
