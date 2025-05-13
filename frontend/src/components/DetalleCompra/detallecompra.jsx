import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BsBoxArrowRight, BsPerson } from 'react-icons/bs';
import './detallecompra.css';

function DetalleCompra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [direccion, setDireccion] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    fetchProductDetails(id);
    fetchUserData(); // Cargar dirección del usuario
    document.body.style.backgroundColor = "white";
  }, [id]);

  const fetchProductDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`);
      const data = await response.json();
      setProducto(data);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/usuario", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario");
      }

      const userData = await response.json();
      setDireccion(userData.direccion || ""); // Prellenar dirección si existe
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  const handleCantidadChange = (valor) => {
    if (valor > 0 && valor <= producto.stock) {
      setCantidad(valor);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const Ir_Pagar = () => {
    navigate("/datos_pago", {
      state: {
        producto: producto,
        cantidad: cantidad,
        direccion: direccion,
        total: producto.price * cantidad,
      },
    });
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };
  const Ir_carrito=()=>{
    navigate("/carrito")
  }

  const Ir_Productos = () => navigate("/productos");
  const Ir_Usuario = () => navigate("/usuarios");
  const Ir_Dashboard = () => navigate("/dashboard");

  if (!producto) return <div>Cargando...</div>;

  return (
    <div className="container_DeCom">
      {/* Barra de navegación fija */}
      <nav className="nav_DeCom">
        <div className="max-w-12xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold" onClick={Ir_Dashboard}>XPMartek</h1>

          {/* Menú de navegación */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="p-2 rounded text-black"
            />
            <i onClick={Ir_carrito} className="bi bi-cart4 text-2xl cursor-pointer"></i>
          </div>

          {/* Menú desplegable Mi cuenta */}
          <div className="relative">
            <button onClick={toggleMenu} className="boton-mi-cuenta flex items-center">
              <BsPerson size={24} />
              <span className="ml-2 hidden md:inline">Mi cuenta</span>
            </button>
            {menuAbierto && (
              <ul className="menu-desplegable">
                <li><a href="/perfil">Perfil</a></li>
                <li><a className="Txt_nav" onClick={handleLogout}>Cerrar sesión</a></li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Detalle del producto */}
      <div className="detalle-compra-container_DeCom">
        <h1 className="producto-nombre_DeCom">{producto.name}</h1>
        <p className="descripcion_DeCom">{producto.description}</p>
        <p className="disponibles_DeCom">Disponibles: {producto.stock}</p>

        <div className="cantidad-control_DeCom">
          <button className="btn_sumar_restar" onClick={() => handleCantidadChange(cantidad - 1)}>-</button>
          <input 
            type="number" 
            value={cantidad} 
            onChange={(e) => handleCantidadChange(Number(e.target.value))} 
            min="1" 
            max={producto.stock} 
          />
          <button className="btn_sumar_restar" onClick={() => handleCantidadChange(cantidad + 1)}>+</button>
          <p className="precio_DeCom">Precio: ${producto.price * cantidad} MNX</p>
        </div>

        <div className="direccion-envio_DeCom">
          <label>Dirección de envío:</label>
          <input 
            type="text" 
            value={direccion} 
            onChange={(e) => setDireccion(e.target.value)} 
            placeholder="Ingrese su dirección" 
          />
        </div>

        <button onClick={Ir_Pagar} className="boton-pagar_DeCom">Pagar</button>
      </div>
    </div>
  );
}

export default DetalleCompra;
