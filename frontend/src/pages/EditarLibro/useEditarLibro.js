import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../constants/messages";

export function useEditarLibro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuario } = useAuth();

  // Estado genérico para el modal de confirmación
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    tipo: null,
    datos: null,
  });

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

  const [preview, setPreview] = useState(null);

  // 1. CARGAR DATOS AL INICIAR
  useEffect(() => {
    const fetchLibro = async () => {
      try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const res = await axios.get(`${URL}/api/libros/${id}`);
        const libro = res.data;

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
        toast.error(APP_MESSAGES.ERRORS.LOAD_BOOK);
      }
    };
    fetchLibro();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function confirmarModal() {
    const ok = await guardarLibroEnServidor();
    if (ok) cerrarModal();
  }

  function cerrarModal() {
    setModalConfig({ isOpen: false, tipo: null, datos: null });
  }
  function modalConfirmarEdicionLibro() {
    setModalConfig({
      isOpen: true,
      tipo: "EDITAR",
      datos: null,
    });
  }

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

  // 2. ENVIAR CAMBIOS (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    modalConfirmarEdicionLibro();
  };

  async function guardarLibroEnServidor() {
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

      if (file) {
        data.append("imagen", file);
      }

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      await axios.put(`${URL}/api/libros/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("¡Libro actualizado correctamente!");
      navigate(usuario?.rol === "editorial" ? "/editorial/libros" : "/admin/libros");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el libro");
      return false;
    }
  }

  // Determinar qué imagen mostrar (la nueva subida o la que ya venía de la BD)
  const imageToShow = preview || formData.portada_url;

  return {
    formData,
    imageToShow,
    handleChange,
    handleFileChange,
    handleSubmit,
    modalConfig,
    cerrarModal,
    confirmarModal,
  };
}
