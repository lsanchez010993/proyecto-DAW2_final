import { useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token") || "";
  }, [location.search]);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Falta el token de recuperación.");
      return;
    }
    if (!password || !password2) {
      toast.error("Debes rellenar ambos campos.");
      return;
    }
    if (password !== password2) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      setIsSubmitting(true);
      const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const res = await axios.post(`${URL}/api/usuarios/reset-password`, {
        token,
        password,
      });

      toast.success(res.data?.mensaje || "Contraseña actualizada correctamente.");
      navigate("/login");
    } catch (error) {
      const mensajeError = error.response?.data?.mensaje || "No se pudo actualizar la contraseña.";
      toast.error("Error: " + mensajeError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f0f2f5" }}>
      <div className="card border-0 shadow-sm p-4" style={{ width: "100%", maxWidth: "420px" }}>
        <h3 className="text-center mb-2 fw-bold">Restablecer contraseña</h3>
        <p className="text-muted text-center mb-4" style={{ fontSize: "0.95rem" }}>
          Introduce tu nueva contraseña.
        </p>

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <input
              type="password"
              className="form-control py-2"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small className="text-muted d-block mt-2">
              Debe tener al menos 6 caracteres, una mayúscula y un número.
            </small>
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control py-2"
              placeholder="Repite la nueva contraseña"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar nueva contraseña"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-primary text-decoration-none small">
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

