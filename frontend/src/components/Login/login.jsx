import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoXp from '/2.jpg';
import "./loginEstilo.css";
import "../Usuarios/Usuario.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Agregado para mostrar mensaje de éxito

  const Ir_Registro = () => {
    navigate("/registros");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Limpiar mensajes previos
    setError(null);
    setSuccessMessage(null);

    axios
  .post("http://127.0.0.1:8000/api/login", { email, password })
  .then((response) => {
    console.log("Usuario autenticado:", response.data); // Verifica la respuesta completa
    // Guarda el token y el ID del usuario en localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user_id", response.data.user.id); // Asegúrate de acceder correctamente a 'user.id'
    setSuccessMessage("¡Bienvenido de nuevo!");
    console.log(localStorage.getItem('user_id'));

    setTimeout(() => {
      window.location.href = "/dashboard"; // Redirige después de un tiempo
    }, 2000);
  })
  .catch((error) => {
    if (error.response) {
      setError(error.response.data.message); // Muestra el mensaje de error
    } else {
      console.error(error);
    }
  });
 
  };

  return (
    <div className="containerLogin">
      {/* Sección de imagen */}
      <div className="image-container"></div>

      {/* Sección del formulario */}
      <div className="form-container">
        <h2 className="text_black">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="text_black">Email</label>
            <input
              className="input2"
              type="email"
              value={email}
               placeholder="user@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text_black">Contraseña</label>
            <input
              className="input2"
              type="password"
              value={password}
               placeholder="*******"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <p>
              ¿No tienes cuenta?{" "}
              <span
                onClick={Ir_Registro}
                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
              >
                Regístrate aquí
              </span>
            </p>
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default Login;
