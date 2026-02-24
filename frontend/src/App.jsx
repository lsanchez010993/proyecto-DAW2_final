import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import DetalleLibro from './pages/DetalleLibro';
import CarritoPage from './pages/CarritoPage';
import LoginPage from './pages/LoginPage'; // [NUEVO IMPORT]
import { CarritoProvider } from './context/CarritoContext';
import RegisterPage from './pages/RegisterPage'; // [NUEVO]
import { AuthProvider } from "./context/AuthContext"; // <--- IMPORTAR
import CrearLibro from './pages/CrearLibro';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminLibros from './pages/AdminLibros';
import EditarLibro from './pages/EditarLibro';


function App() {
  return (
    <AuthProvider> 
    <BrowserRouter>
      <CarritoProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/libro/:id" element={<DetalleLibro />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/crear-libro" element={<CrearLibro />} />
          
          
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/libros" element={<AdminLibros />} />
          <Route path="/editar-libro/:id" element={<EditarLibro />} />
        </Routes>
      </CarritoProvider>
    </BrowserRouter>
    </AuthProvider>
  );
}
export default App;