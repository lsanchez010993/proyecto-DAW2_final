import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from 'react-hot-toast'; 
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DetalleLibro from "./pages/DetalleLibro";
import CarritoPage from "./pages/CarritoPage";
import LoginPage from "./pages/LoginPage";
import { CarritoProvider } from "./context/CarritoContext";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import CrearLibro from "./pages/CrearLibro";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminLibros from "./pages/AdminLibros";
import EditarLibro from "./pages/EditarLibro";
import EditarPerfil from "./pages/EditarPerfil";
import Categorias from "./pages/Categorias";
import Editoriales from "./pages/Editoriales";
import Autores from "./pages/Autores";
import Footer from './components/Footer';
import MenuExplorar from './components/MenuExplorar';



axios.interceptors.response.use(
  (response) => {
    // Si la respuesta del backend es correcta, la dejamos pasar sin tocarla
    return response;
  },
  (error) => {
    // Si el backend nos da un error, el interceptor lo frena aquí
    if (error.response && error.response.status === 401) {
      console.warn("🚨 Token caducado o inválido. Cerrando sesión por seguridad.");
      
      // 1. Destruimos la memoria corrupta
      localStorage.removeItem("token");
      localStorage.removeItem("usuario_quedelibros");
      
      // 2. Expulsamos al usuario a la pantalla de login
      // Usamos window.location porque estamos fuera del contexto de React Router
      window.location.href = "/login?expirado=true";
    }
    
    // Si es otro tipo de error (como un 404 o un 500), dejamos que el componente lo maneje
    return Promise.reject(error);
  }
);


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CarritoProvider>
          
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />
          
          {/* Contenedor principal: le damos una altura mínima para empujar el footer hacia abajo */}
          <div className="container mt-4 mb-5" style={{ minHeight: "75vh" }}>
            <MenuExplorar />
            <Routes>
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/editoriales" element={<Editoriales />} />
              <Route path="/autores" element={<Autores />} />
              <Route path="/" element={<Home />} />
              <Route path="/libro/:id" element={<DetalleLibro />} />
              <Route path="/carrito" element={<CarritoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/crear-libro" element={<CrearLibro />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              <Route path="/perfil" element={<EditarPerfil />} />
              <Route path="/admin/libros" element={<AdminLibros />} />
              <Route path="/editar-libro/:id" element={<EditarLibro />} />
            </Routes>
          </div>

         
          <Footer /> 

        </CarritoProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;