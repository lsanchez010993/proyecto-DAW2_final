import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al cargar la app, compruebo ambas variables 
  useEffect(() => {
    const usuarioGuardado =
      localStorage.getItem("usuario_quedelibros") ||
      sessionStorage.getItem("usuario_quedelibros");
    const tokenGuardado =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (usuarioGuardado && tokenGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  // Función para iniciar sesion
  const login = (datosRespuesta, recordarSesion) => {
    const { token, usuario: datosUsuario } = datosRespuesta;

    setUsuario(datosUsuario);

   
    const storage = recordarSesion ? localStorage : sessionStorage;

    storage.setItem("usuario_quedelibros", JSON.stringify(datosUsuario));
    storage.setItem("token", token);
  };

  // Función para cerrar sesion
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario_quedelibros");
    localStorage.removeItem("token");
    sessionStorage.removeItem("usuario_quedelibros");
    sessionStorage.removeItem("token");
  };

  // Función para actualizar datos de perfil
  const actualizarUsuario = (datosActualizados) => {
    setUsuario(datosActualizados);

    
    if (sessionStorage.getItem("token")) {
      sessionStorage.setItem(
        "usuario_quedelibros",
        JSON.stringify(datosActualizados),
      );
    } else {
      localStorage.setItem(
        "usuario_quedelibros",
        JSON.stringify(datosActualizados),
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{ usuario, login, logout, cargando, actualizarUsuario }}
    >
      {!cargando && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
