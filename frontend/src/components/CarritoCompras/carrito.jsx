import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import "./carrito.css";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetchCarrito(userId);
    } else {
      console.log("No se encontró user_id en localStorage");
    }
  }, []);

  const fetchCarrito = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/carrito?user_id=${userId}`);
      if (!response.ok) {
        throw new Error("Error al obtener el carrito");
      }
      const data = await response.json();
      setCarrito(data);
    } catch (error) {
      console.error("Error al obtener los productos del carrito:", error);
    }
  };

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Usuario no identificado");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/carrito/actualizar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, producto_id: productoId, cantidad: nuevaCantidad }),
      });

      if (response.ok) {
        setCarrito((prevCarrito) =>
          prevCarrito.map((item) =>
            item.producto_id === productoId ? { ...item, cantidad: nuevaCantidad } : item
          )
        );
      } else {
        alert("Error al actualizar la cantidad");
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
    }
  };

  const eliminarDelCarrito = async (carritoId) => {
    try {
        // 🛑 Confirmación antes de eliminar
        const result = await window.Swal.fire({
          title: "🗑️ ¿Eliminar producto?",
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar"
      });
      

        // Si el usuario cancela, no hacemos nada
        if (!result.isConfirmed) return;

        const response = await fetch(`http://localhost:8000/api/carrito/eliminar/${carritoId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            // ✅ Producto eliminado con éxito
            setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== carritoId));

            window.Swal.fire({
                title: "Producto eliminado",
                text: "Se eliminó correctamente del carrito.",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
                toast: true,
                position: "top-end",
            });
        } else {
            // ❌ Error al eliminar
            window.Swal.fire({
                title: "Error",
                text: "No se pudo eliminar el producto ❌",
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
                toast: true,
                position: "top-end",
            });
        }
    } catch (error) {
        // ⚠️ Error de conexión
        console.error("Error al eliminar el producto del carrito:", error);
        window.Swal.fire({
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor",
            icon: "warning",
            showConfirmButton: true,
        });
    }
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const Ir_carrito=()=>{
    navigate ("/carrito");
  }

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <div>
      {/* Barra de navegación */}
      <nav className="nav_DeCom">
        <div className="max-w-12xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold" onClick={() => navigate("/dashboard")}>XPMarket</h1>

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

      {/* Contenido del carrito con mayor espacio */}
      <div className="contentProductosDashCarrito">
        <div className="container-fluid text-center">
          <h1 className="mb-4">Carrito de compras</h1>
          {carrito.length === 0 ? (
            <p>No tienes productos en tu carrito.</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {carrito.map((item) => (
                <div key={item.id} className="col">
                  <div className="card h-100 shadow-lg">
                    <img
                      src={`http://localhost:8000/storage/${item.producto.image}`}
                      alt={item.producto.name}
                      className="card-img-top img-fluid"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.producto.name}</h5>
                      <p className="text-success font-weight-bold">${item.producto.price}</p>

                      {/* Controles de cantidad */}
                      <div className="d-flex justify-content-center align-items-center mb-3">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            item.cantidad > 1
                              ? actualizarCantidad(item.producto_id, item.cantidad - 1)
                              : eliminarDelCarrito(item.producto_id)
                          }
                        >
                          -
                        </button>
                        <span className="mx-3">{item.cantidad}</span>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => actualizarCantidad(item.producto_id, item.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Botón de eliminar */}
                      <button
                        className="btn btn-danger w-100"
                        onClick={() => eliminarDelCarrito(item.id)}
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrito;
