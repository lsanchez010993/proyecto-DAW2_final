import { useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../constants/messages";

export default function ResetPasswordPage() {
  const M = APP_MESSAGES.PAGES.RESET_PASSWORD;
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
    <main className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "#f0f2f5" }}>
      
      <section 
        className="card border-0 shadow-sm p-4" 
        style={{ width: "100%", maxWidth: "420px" }}
        aria-labelledby="titulo-reset"
      >
        <header>
          <h1 id="titulo-reset" className="h3 text-center mb-2 fw-bold">{M.TITULO}</h1>
          <p className="text-muted text-center mb-4" style={{ fontSize: "0.95rem" }}>
            {M.SUBTITULO}
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate>
          
          <div className="mb-3">
            <label htmlFor="reset-pass1" className="visually-hidden">
              {M.PLACEHOLDER_PASSWORD || "Nueva contraseña"}
            </label>
            <input
              id="reset-pass1"
              type="password"
              className="form-control py-2"
              placeholder={M.PLACEHOLDER_PASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
              aria-describedby="help-pass1" 
            />
            <small id="help-pass1" className="text-muted d-block mt-2">
              {M.AYUDA_PASSWORD}
            </small>
          </div>

          <div className="mb-3">
            <label htmlFor="reset-pass2" className="visually-hidden">
              {M.PLACEHOLDER_PASSWORD_REPEAT || "Repetir nueva contraseña"}
            </label>
            <input
              id="reset-pass2"
              type="password"
              className="form-control py-2"
              placeholder={M.PLACEHOLDER_PASSWORD_REPEAT}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-bold" 
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? M.GUARDANDO : M.GUARDAR}
          </button>
        </form>

        <footer className="text-center mt-3">
          <Link to="/login" className="text-primary text-decoration-none small">
            {M.VOLVER_LOGIN}
          </Link>
        </footer>
      </section>
    </main>
  );
}