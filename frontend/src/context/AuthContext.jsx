import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al cargar la app, miramos en AMBOS sitios
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

  // Función para INICIAR SESIÓN (ahora recibe un segundo parámetro)
  const login = (datosRespuesta, recordarSesion) => {
    const { token, usuario: datosUsuario } = datosRespuesta;

    setUsuario(datosUsuario);

    // Decidimos qué caja usar según el checkbox
    const storage = recordarSesion ? localStorage : sessionStorage;

    storage.setItem("usuario_quedelibros", JSON.stringify(datosUsuario));
    storage.setItem("token", token);
  };

  // Función para CERRAR SESIÓN (limpiamos las dos cajas por si acaso)
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario_quedelibros");
    localStorage.removeItem("token");
    sessionStorage.removeItem("usuario_quedelibros");
    sessionStorage.removeItem("token");
  };

  // Función para ACTUALIZAR DATOS DEL PERFIL EN VIVO
  const actualizarUsuario = (datosActualizados) => {
    setUsuario(datosActualizados);

    // Actualizamos en la caja donde el usuario decidió guardar su sesión inicialmente
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
