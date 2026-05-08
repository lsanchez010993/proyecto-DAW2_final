import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

// Client ID de Google leído desde variables de entorno (Vite).
// Si no existe, queda vacío y la app funciona sin Google OAuth.
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";


// - Si hay Google Client ID, envuelvo la aplicación con GoogleOAuthProvider.
// - Si no hay ID, renderizo  la App directamente.
const appTree = googleClientId ? (
  <GoogleOAuthProvider clientId={googleClientId}>
    <App />
  </GoogleOAuthProvider>
) : (
  <App />
);

// En desarrollo (import.meta.env.DEV) StrictMode para detectar problemas potenciales.
// En producción se desactiva el modo estricto para evitar dobles renders de desarrollo.
const rootContent = import.meta.env.DEV
  ? <React.StrictMode>{appTree}</React.StrictMode>
  : appTree;

// Renderiza React en el elemento root del index.html.
ReactDOM.createRoot(document.getElementById("root")).render(rootContent);