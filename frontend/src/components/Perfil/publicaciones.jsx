import React, { useState, useEffect } from "react";
import { BsPerson } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { addProduct } from "../Productos/apiProductos";
import "./perfil.css";

const Publicaciones = () => {
  const navigate = useNavigate(); // Definir navigate
  const [searchTerm, setSearchTerm] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      console.log("ID del usuario:", storedUserId);
    } else {
      console.log("No se encontró el user_id en el localStorage");
      navigate("/login"); // Si no hay un user_id en el localStorage, redirigir al login
    }
  }, [navigate]); // Agregar navigate como dependencia
  

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/login";
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isNaN(precio) || precio.trim() === "") {
      Swal.fire({
        title: "Error",
        text: "El precio debe ser un número válido.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    if (isNaN(stock) || stock <= 0) {
      Swal.fire({
        title: "Error",
        text: "El stock debe ser un número mayor a 0.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }
  
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", titulo);
    formData.append("description", descripcion);
    formData.append("price", parseFloat(precio));
    formData.append("stock", stock);
    if (image) {
      formData.append("image", image);
    }
    formData.append("id_user", userId);
  
    console.log("Datos enviados:", formData);
  
    try {
      const response = await addProduct(formData);
      console.log("Respuesta del servidor:", response);
  
      // Si el estado HTTP es 201 (Created), mostrar el mensaje y redirigir
      if (response.status === 201) {
        Swal.fire({
          title: "¡Éxito!",
          text: "El producto se subió correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          navigate("/perfil"); // Redirige al perfil después de cerrar el mensaje
        });
  
        // Limpiar los campos
        setTitulo("");
        setDescripcion("");
        setPrecio("");
        setStock(0);
        setImage(null);
      } else {
        throw new Error("El servidor no confirmó la creación del producto.");
      }
    } catch (error) {
      console.error("Error al agregar la publicación:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al subir tu publicación. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };
  

  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="container">
      {/*Nav por si se quisiera*/}
      <div className="form-container">
        <div className="form-card">
          <h2 className="h2_text">Subir Nueva Publicación</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Título:
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </label>
            <label>
              Descripción:
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
            </label>
            <label>
              Stock:
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </label>
            <label>
              Precio:
              <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
            </label>
            <label>
              Imagen:
              <input className="input" type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            <button type="submit" className="btn-submit">Subir Publicación</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Publicaciones;
