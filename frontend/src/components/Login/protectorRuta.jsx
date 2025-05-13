import { Navigate, Outlet } from "react-router-dom";

const ProtectorRuta = () => {
  // Verifica si el token está presente en el localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" />;
  }

  // Si hay un token, permite acceder al contenido de la ruta (dashboard, por ejemplo)
  return <Outlet />;
};

export default ProtectorRuta;
