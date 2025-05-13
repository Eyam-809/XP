import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BsBoxArrowRight, BsPerson } from 'react-icons/bs';
import "../dashboard.css";
import "../../Usuarios/Usuario.css";
import "./detalleproducto.css";
import LogoXp from '/LogoXP.png';

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    fetchProductDetails(id);
    document.body.style.backgroundColor = "white";
  }, [id]);

  const fetchProductDetails = async (id) => {
    const response = await fetch(`http://localhost:8000/api/products/${id}`);
    const data = await response.json();
    setProducto(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const Ir_Productos = () => {
    navigate("/productos");
  };

  const Ir_Usuario = () => {
    navigate("/usuarios");
  };

  const Ir_Dash = () => {
    navigate("/dashboard");
  };

  const Ir_DetalleCompra = () => {
    navigate(`/detallecompra/${id}`);
  };

  if (!producto) return <div>Cargando...</div>;

  const agregarAlCarrito = async (productoId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id") || 'guest';  // Usa 'guest' si no hay user_id en el localStorage

    console.log("Token:", token);
    console.log("Producto ID:", productoId);
    console.log("User ID:", userId);  // Verificar que el user_id se está enviando correctamente

    const response = await fetch("http://localhost:8000/api/carrito/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            producto_id: productoId,
            cantidad: 1,  // La cantidad es siempre 1
            user_id: userId,  // Enviar el user_id
        }),
    });

    if (response.ok) {
      const data = await response.json();

      // ✅ Muestra el mensaje con window.Swal
      window.Swal.fire({
          title: "¡Producto agregado!",
          text: `Has añadido el producto al carrito 🛒`,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          position: "top-end",
      });
  } else {
      // ❌ Si la respuesta no es OK
      window.Swal.fire({
          title: "Error",
          text: "No se pudo agregar el producto ❌",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          position: "top-end",
      });
  }
};

  return (
    <div>
      {/* Barra de navegación fija */}
      <nav>
        <div className="max-w-12xl mx-auto flex justify-between items-center">
          <h1 onClick={() => navigate("/dashboard")} className="text-xl font-bold">
            XPMartek
          </h1>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="p-2 rounded text-black"
            />
            <i onClick={() => navigate("/carrito")} className="bi bi-cart4 text-2xl cursor-pointer"></i>
          </div>

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

      <div className="detalle-container">
        {/* Contenido del detalle del producto */}
        <div className="producto-detalle">
          {/* Sección de imágenes */}
          <div className="producto-imagenes">
            {/* Usar la ruta completa para la imagen */}
            <img
              className="imagen-principal"
              src={`http://localhost:8000/storage/${producto.image}`}
              alt={producto.name}
            />
          </div>
          
          {/* Información del producto */}
          <div className="producto-info">
            <h1 className="producto-nombre">{producto.name}</h1>
            <p className="descripcion">{producto.description}</p>
            <p className="precio">${producto.price}</p>

            {/* Botones de compra */}
            <button className="boton-comprar" onClick={Ir_DetalleCompra}>Comprar ahora</button>
            <button className="boton-carrito" onClick={() => agregarAlCarrito(producto.id)}>Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;
