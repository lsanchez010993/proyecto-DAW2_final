import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../constants/messages";

export function useEditarPerfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const [pestañaActiva, setPestañaActiva] = useState("datos");
  const esEditorial = usuario?.rol === "editorial";
  const editorial = usuario?.nombre_editorial || "";

  // Estados del perfil

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [preferencias, setPreferencias] = useState([]);
  const [direccion, setDireccion] = useState({
    calle: "",
    ciudad: "",
    codigo_postal: "",
    pais: "",
    telefono: "",
  });

  // Estados Modal
  const [showModal, setShowModal] = useState(false);
  const [passData, setPassData] = useState({ actual: "", nueva: "", confirmar: "" });

  const opcionesPreferencias = [
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
          telefono: usuario.direccion.telefono || "",
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

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = getToken();
      const res = await axios.put(
        `${URL}/api/usuarios/perfil`,
        { nombre, apellidos, email, preferencias, direccion },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      actualizarUsuario(res.data);
      toast.success(APP_MESSAGES.NOTIFICATIONS.PROFILE_UPDATED);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al guardar el perfil");
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (passData.nueva !== passData.confirmar) {
      return toast.error(APP_MESSAGES.ERRORS.PASSWORD_MISMATCH);
    }
    try {
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const token = getToken();
      await axios.put(
        `${URL}/api/usuarios/cambiar-password`,
        { actual: passData.actual, nueva: passData.nueva },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(APP_MESSAGES.SUCCESS.UPDATE_PASSWORD);
      setShowModal(false);
      setPassData({ actual: "", nueva: "", confirmar: "" });
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.mensaje ||
        APP_MESSAGES.ERRORS.UPDATE_PASSWORD;
      toast.error(msg);
    }
  };

  return {
    pestañaActiva,
    setPestañaActiva,
    nombre,
    setNombre,
    apellidos,
    setApellidos,
    email,
    setEmail,
    preferencias,
    direccion,
    showModal,
    setShowModal,
    passData,
    opcionesPreferencias,
    togglePreferencia,
    handleDireccionChange,
    handlePassChange,
    handleSubmit,
    submitPassword,
    esEditorial,
    editorial,
  };
}
