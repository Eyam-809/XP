import { useNavigate } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import "../Usuarios/Usuario.css";

function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [productos, setProductos] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUser] = useState(null);

  useEffect(() => {
    fetchProductos();
    document.body.style.backgroundColor = "white";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const fetchProductos = async () => {
    const response = await fetch("http://localhost:8000/api/products");
    const data = await response.json();
    setProductos(data);
  };



  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const Ir_carrito=()=>{
    navigate("/carrito")
  }

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const verDetallesProducto = (id) => navigate(`/detalleproducto/${id}`);

  //const plan_id = localStorage.getItem("plan_id" || 0)
  //console.log("este es el plan que tiene " + plan_id)

  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data);
    }
  };

  fetchUser();
}, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResults([]);
      return;
    }

    const filteredProducts = productos.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredResults(filteredProducts);
  }, [searchTerm, productos]);

  // Función para agregar producto al carrito
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
            cantidad: 1,
            user_id: userId,  // Enviar el user_id
        }),
    });

    if (response.ok) {
      const data = await response.json();
      //console.log("Respuesta del servidor al agregar al carrito:", data);

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
console.log(usuario)
  return (
    <div>
      <nav>
        <div className="max-w-12xl mx-auto flex justify-between items-center">
          <h1 onClick={() => navigate("/dashboard")} className="text-xl font-bold">
            XPMarket
          </h1>

          {/* Contenedor para organizar el buscador y el carrito */}
          <div className="flex items-center gap-8">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded text-black"
            />
            {/*//icono de Carrito*/}
            <i onClick={Ir_carrito} className="bi bi-cart4 text-2xl cursor-pointer"></i>
           
             {/* Íconos visibles solo si el plan_id NO es 1 */}
            {usuario?.plan_id ===2 &&(
              <>
               {/*//icono de Intercanbio*/}
                <i onClick={Ir_carrito} className="bi bi-arrows-expand-vertical text-2xl border-red-500 rounded-md p-3 cursor-pointer"></i>
                {/*//icono de chat*/}
                <i onClick={Ir_carrito} className="bi bi-chat-left-text text-2xl cursor-pointer"></i>
              </>
            )}
          </div>


          {/* Contenedor del botón de cuenta */}
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



      <div className="contentProductosDash">
        <div className="container text-center">
          {searchTerm.trim() && filteredResults.length === 0 ? (
            <p>No existe ningún artículo con "{searchTerm}"</p>
          ) : (
            <div className={`row ${(searchTerm.trim() ? filteredResults : productos).length === 1 ? 'justify-content-center' : 'row-cols-md-3'}`}>
              {(searchTerm.trim() ? filteredResults : productos).map((producto) => (
                <div key={producto.id} className={`col ${productos.length === 1 ? 'col-12' : ''}`}>
                  <div className="card">
                    <img
                      onClick={() => verDetallesProducto(producto.id)}
                      src={`http://localhost:8000/storage/${producto.image}`}
                      alt={producto.name}
                      width="100"
                      height="200"
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="card-title">{producto.name}</h6>
                      <p className="card-text truncated">{producto.description}</p>
                      <p className="text-success font-weight-bold">${producto.price}</p>
                      <button
                        className="btn btn-warning"
                        onClick={() => agregarAlCarrito(producto.id)}
                      >
                        <i className="bi bi-cart4"></i> Agregar al carrito
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

export default Dashboard;
