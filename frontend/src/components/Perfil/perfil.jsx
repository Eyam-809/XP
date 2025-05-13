import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import axios from "axios";
import "./perfil.css"; // Importamos el CSS

const PerfilUser = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Guardará los productos
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("publicaciones"); // Controla la pestaña activa
  const [userInfo, setUserInfo] = useState(null); // Guardará la info del usuario
  const [editar, setEditar] = useState(false); // Estado para controlar la ventana de edición
  const [productoEditando, setProductoEditando] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    telefono: "",
    direccion: "",
  }); // Estado para almacenar los datos que el usuario va a editar
  
  

  useEffect(() => {
    document.body.style.backgroundColor = "white";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    fetchUserInfo();
    fetchUserProducts(); // Llamada para obtener los productos
  }, []);

  const handleEdit = () => {
    setUserData({
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      telefono: userInfo?.telefono || "",
      direccion: userInfo?.direccion || "",
    });
    setEditar(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token disponible.");
        return;
      }

      // Verifica que los datos estén correctos
      console.log("Datos a enviar:", userData);

      const response = await axios.put(
        "http://localhost:8000/api/usuario", // Asegúrate de que esta URL sea la correcta
        userData, 
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("Respuesta de la API:", response.data);

      // Si todo está bien, actualiza el estado
      setUserInfo(userData);
      setEditar(false); // Cierra la ventana de edición
    } catch (error) {
      console.error("Error actualizando la información:", error);
    }
  };

  // Obtener datos del usuario autenticado
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token"); // Asegúrate de que el token se guarde al iniciar sesión
      if (!token) {
        console.error("No hay token disponible.");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/usuario", {
        headers: {
          Authorization: `Bearer ${token}`, // Enviamos el token en la cabecera
        },
      });

      setUserInfo(response.data);
    } catch (error) {
      console.error("Error obteniendo la información del usuario:", error);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/user/products", { // Endpoint corregido
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    }
  };
  
  const handleEditProduct = (product) => {
    //console.log("Editar producto:", product);
    setProductoEditando(product);
    // Aquí puedes abrir un modal para editar el producto
  };

  const handleSaveEditProduct = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/api/products/${product.id}`, 
        product,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Producto actualizado:", response.data);
      
      // Actualizar la lista de productos sin recargar
      setProducts(products.map(p => p.id === product.id ? response.data : p));
  
      // Cerrar el modal
      setProductoEditando(null);
    } catch (error) {
      console.error("Error actualizando el producto:", error);
    }
  };
  
  
  const handleDeleteProduct = async (productId) => {
    // Mostrar un mensaje de confirmación con SweetAlert2
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Este producto se eliminará permanentemente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    // Si el usuario confirma la eliminación, proceder con la eliminación
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No hay token disponible.");
          return;
        }
  
        // Llamar al API para eliminar el producto
        await axios.delete(`http://localhost:8000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Filtrar los productos para quitar el eliminado
        setProducts(products.filter((product) => product.id !== productId));
  
        // Mostrar una alerta de éxito
        Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error eliminando el producto:", error);
        Swal.fire("Error", "Hubo un problema al eliminar el producto.", "error");
      }
    }
  };
  

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const Ir_Dash = () => {
    navigate("/dashboard");
  };

  const Ir_Plublicar = () => {
    navigate("/publicaciones");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container-fluid">
      {/* Navbar */}
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

      {/* User Info */}
      <div className="profile_pf">
        <div className="profile-pic_pf">
          <img src={userInfo?.profile_pic || "/path-to-profile-pic.jpg"} alt="Profile" />
        </div>
        <h2>{userInfo?.name || "Cargando..."}</h2>
        <div className="buttons_pf">
          <button className="btn_pf btn-primary_pf" onClick={Ir_Plublicar} >Publicar</button>
          <button className="btn_pf btn-secondary_pf" onClick={handleEdit}>Editar</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs_pf">
        <span
          className={activeTab === "publicaciones" ? "active_pf" : ""}
          onClick={() => setActiveTab("publicaciones")}
        >
          Publicaciones
        </span>
        <span
          className={activeTab === "informacion" ? "active_pf" : ""}
          onClick={() => setActiveTab("informacion")}
        >
          Información
        </span>
        <span
          className={activeTab === "resenas" ? "active_pf" : ""}
          onClick={() => setActiveTab("resenas")}
        >
          Reseñas
        </span>
      </div>

      {/* Contenido dinámico */}
      <div className="content_pf">
        {activeTab === "publicaciones" && (
          <div className="products_pf">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={index} className="product_pf">
                  <div className="image-placeholder_pf">
                    <img
                      src={`http://localhost:8000/storage/${product.image}`}
                      alt={product.name}
                      className="product-image_pf"
                      style={{ width: "150px", height: "100px", objectFit: "cover" }} 
                    />
                  </div>
                  <h3>{product.name}</h3>
                  <p className="category_pf">{product.category}</p>
                  <p className="price_pf">${product.price}</p>
                   {/* Botones de editar y eliminar */}
                  <div className="product-actions">
                    <button className="btn btn-edit" onClick={() => handleEditProduct(product)}><i class="bi bi-pencil-square"></i></button>
                    <button className="btn btn-delete" onClick={() => handleDeleteProduct(product.id)}><i class="bi bi-trash3"></i></button>
                  </div>
                </div>
              ))
            ) : (
              <p>No tienes publicaciones.</p>
            )}
          </div>
        )}

{activeTab === "informacion" && userInfo && (
  <div className="info-section_pf"> {/* Cambiar la clase aquí */}
    <h3>Información del Usuario</h3>
    <p><strong>Nombre:</strong> {userInfo.name}</p>
    <p><strong>Email:</strong> {userInfo.email}</p>
    <p><strong>Teléfono:</strong> {userInfo.telefono || "No disponible"}</p>
    <p><strong>Dirección:</strong> {userInfo.direccion || "No disponible"}</p>
  </div>
)}
      </div>

      {productoEditando && (
          <div className="edit-modal">
            <h3>Editar Producto</h3>
            <label>
              Nombre:
              <input
                type="text"
                value={productoEditando.name}
                onChange={(e) => setProductoEditando({ ...productoEditando, name: e.target.value })}
              />
            </label>
            <label>
              Descripción:
              <input
                type="text"
                value={productoEditando.description}
                onChange={(e) => setProductoEditando({ ...productoEditando, description: e.target.value })}
              />
            </label>
            <label>
              Precio:
              <input
                type="number"
                value={productoEditando.price}
                onChange={(e) => setProductoEditando({ ...productoEditando, price: e.target.value })}
              />
            </label>
            <label>
              Stock:
              <input
                type="number"
                value={productoEditando.stock}
                onChange={(e) => setProductoEditando({ ...productoEditando, stock: e.target.value })}
              />
            </label>
            <button onClick={() => handleSaveEditProduct(productoEditando)}>Guardar Cambios</button>
            <button onClick={() => setProductoEditando(null)}>Cancelar</button>
          </div>
        )}


      {/* Modal de edición usuario */}
      {editar && (
        <div className="edit-modal">
          <h3>Editar Información</h3>
          <label>
            Nombre:
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              value={userData.telefono}
              onChange={(e) => setUserData({ ...userData, telefono: e.target.value })}
            />
          </label>
          <label>
            Dirección:
            <input
              type="text"
              value={userData.direccion}
              onChange={(e) => setUserData({ ...userData, direccion: e.target.value })}
            />
          </label>
          <button onClick={handleSave}>Guardar Cambios</button>
          <button onClick={() => setEditar(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default PerfilUser;
