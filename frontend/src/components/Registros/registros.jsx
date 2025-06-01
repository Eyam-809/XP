import { useEffect, useState } from "react";
import axios from "axios";
import { data, useNavigate } from "react-router-dom"; // Importa useNavigate
import "./registro.css";

function Registro() {
  // Estados para el formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [telefono, setTelefono] = useState(""); // Nuevo estado para teléfono
  const [direccion, setDireccion] = useState(""); // Nuevo estado para dirección
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  //PLANES
  const [planSeleccionado, setPlanSeleccionado] = useState("");
  const [planes, setPlanes] = useState([]);

  const navigate = useNavigate(); // Inicializa useNavigate

  // Maneja el envío del formulario
  const registrarUsuario = async (e) => {
    e.preventDefault();

    // Verificar si los campos están vacíos
    if (!name || !email || !password || !password_confirmation) {
        setErrors({ general: 'Por favor, complete todos los campos obligatorios' });
        return;
    }

    const datos = {
        name,
        email,
        password,
        password_confirmation,
        telefono, // Ahora está definido
        direccion,  // Ahora está definido
        plan_id: planSeleccionado
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/registros", datos);

        setMessage(response.data.message);
        setErrors({});
        navigate("/login");
    } catch (error) {
        if (error.response && error.response.data.errors) {
            setErrors(error.response.data.errors);
        }
    }
};

useEffect(() => {
    // Llama al backend para obtener los planes
    fetch("http://localhost:8000/api/plan")
      .then((response) => response.json())
      .then((data) => {
        setPlanes(data); // Guardamos los planes en el estado
      })
      .catch((error) => {
        console.error("Error al obtener los planes:", error);
      });
  }, []);


  return (
    <div className="containerRegistro">
      <h1>Registro de usuarios</h1>
      {/* Formulario de registro */}
      <form onSubmit={registrarUsuario}>
        <div>
          <label>Nombre:</label>
          <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input 
            type="text" 
            placeholder="Teléfono" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
          />
        </div>
        <div>
          <label>Dirección:</label>
          <input 
            type="text" 
            placeholder="Dirección" 
            value={direccion} 
            onChange={(e) => setDireccion(e.target.value)} 
          />
        </div>
        {/*apartado de planes*/}
        <div>
          <label>Elija un plan:</label>
          <select value={planSeleccionado} onChange={(e) => setPlanSeleccionado(e.target.value)}>
            <option value="">-- Selecciona una opción --</option>
            {planes.map((plan) => (
              <option key={plan.nombre} value={plan.id}>
                {plan.nombre}
              </option>
            ))}
          </select>

            {planSeleccionado && (
                <p>
                  Esto trae el plan:{" "}
                  <strong>
                    {
                      planes.find((plan) => plan.id === parseInt(planSeleccionado))?.nombre
                    }
                  </strong>
                  <strong>
                    {
                      planes.find((plan) => plan.id === parseInt(planSeleccionado))?.descripcion
                    }
                  </strong>
                </p>
              )}
          </div>


        <div className="conatiner">
          <div class="row">
            <div class="col-4">
            <button className="btnVolver" onClick={() => navigate(-1)}>Volver</button>
            </div>
            <div class="col-8">
            <button className="btnRegistrar" type="submit" class="btn btn-primary">Registrar</button>
            </div>
          </div>
        </div>

        {/* Mostrar errores si los hay */}
        {Object.keys(errors).length > 0 && (
          <div style={{ color: "red" }}>
            <ul>
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error[0]}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Mostrar mensaje de éxito si se registró el usuario */}
        {message && <div style={{ color: "green" }}>{message}</div>}
      </form>
    </div>
  );
}

export default Registro;
