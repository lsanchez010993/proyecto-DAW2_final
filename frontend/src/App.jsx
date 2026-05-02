import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "react-hot-toast";

import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/index.jsx";
import DetalleLibro from "./pages/DetalleLibro/index";
import CarritoPage from "./pages/CarritoPage";
import IniciarSesionPage from "./pages/IniciarSesion";
import { CarritoProvider } from "./context/CarritoContext";
import RegistroUserPage from "./pages/RegistroUser";
import { AuthProvider } from "./context/AuthContext";
import AdminUsuarios from "./pages/AdminUsuarios/index";
import AdminLibrosAdministrador from "./pages/AdminLibrosAdministrador";
import AdminLibrosEditorial from "./pages/AdminLibrosEditorial";
import EditarLibro from "./pages/EditarLibro";
import EditarPerfil from "./pages/EditarPerfil";
import Categorias from "./pages/Categorias";
import Editoriales from "./pages/Editoriales";
import Libros from "./pages/Libros";
import Autores from "./pages/Autores";
import Footer from "./components/Footer";
import MenuExplorar from "./components/MenuExplorar";
import AfegirLibroPage from "./pages/AfegirLibro";
import ResetPasswordPage from "./pages/ResetPassword";
import HistorialComprasPage from "./pages/HistorialCompras";
import HistorialDescargasPage from "./pages/HistorialDescargas";
import CheckoutSimulacionPage from "./pages/CheckoutSimulacion";
import AdministrarCompras from "./pages/AdministrarCompras";
import FavoritosPage from "./pages/Favoritos";

axios.interceptors.response.use(
  (response) => {
    // Comprueba si la respuesta del backend es correcta 
    return response;
  },
  (error) => {
    // Si el backend da un error, el interceptor lo frena aquí
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const hasToken = Boolean(localStorage.getItem("token"));

    // Si es el login/registro y da 401/400, lo debe manejar el componente (mostrar "credenciales inválidas", etc.)
    const isAuthEndpoint =
      requestUrl.includes("/api/usuarios/login") || requestUrl.includes("/api/usuarios");

    if (status === 401 && hasToken && !isAuthEndpoint) {
      console.warn("🚨 Token caducado o inválido. Cerrando sesión por seguridad.");

      // Destruye la memoria corrupta
      localStorage.removeItem("token");
      localStorage.removeItem("usuario_quedelibros");

      // Expulsa al usuario a la pantalla de login
      // Usamos window.location porque estamos fuera del contexto de React Router
      window.location.href = "/login?expirado=true";
    }

    // Si es otro tipo de error (como un 404 o un 500), deja que el componente lo maneje
    return Promise.reject(error);
  },
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CarritoProvider>
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />

          
          <div className="container mt-4 mb-5" style={{ minHeight: "75vh" }}>
            <MenuExplorar />
            <Routes>
              <Route path="/afegirLibro" element={<AfegirLibroPage />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/editoriales" element={<Editoriales />} />
              <Route path="/autores" element={<Autores />} />
              <Route path="/" element={<Home />} />
              <Route path="/libro/:id" element={<DetalleLibro />} />
              <Route path="/carrito" element={<CarritoPage />} />
              <Route path="/login" element={<IniciarSesionPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/registro" element={<RegistroUserPage />} />
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              <Route path="/perfil" element={<EditarPerfil />} />
              <Route path="/admin/libros" element={<AdminLibrosAdministrador />} />
              <Route path="/editorial/libros" element={<AdminLibrosEditorial />} />
              <Route path="/editar-libro/:id" element={<EditarLibro />} />
              <Route path="/libros" element={<Libros />} />
              <Route path="/historial/compras" element={<HistorialComprasPage />} />
              <Route path="/historial/descargas" element={<HistorialDescargasPage />} />
              <Route path="/checkout" element={<CheckoutSimulacionPage />} />
              <Route path="/admin/compras" element={<AdministrarCompras />} />
              <Route path="/favoritos" element={<FavoritosPage />} />
            </Routes>
          </div>

          <Footer />
        </CarritoProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
