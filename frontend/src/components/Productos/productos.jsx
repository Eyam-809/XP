import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, addProduct, deleteProduct, updateProduct } from "../Productos/apiProductos";
import "../Usuarios/Usuario.css";

function Productos() {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", stock: "", image: "" });
  const [productEditando, setProductEditando] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await getProducts();
    setProducts(response.data);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateProduct(productEditando.id, productEditando);
      setProductEditando(null);
    } else {
      await addProduct(productForm);
      setProductForm({ name: "", description: "", price: "", stock: "", image: "" });
    }
    fetchProducts();
    setModalOpen(false);
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  const openModalForEdit = (product) => {
    setProductEditando(product);
    setIsEditing(true);
    setModalOpen(true);
  };

  const openModalForAdd = () => {
    setProductForm({ name: "", description: "", price: "", stock: "", image: "" });
    setIsEditing(false);
    setModalOpen(true);
  };

  return (
    <div className="container">
      <h1 className="h1_title">Catálogo de Productos</h1>
      <button onClick={openModalForAdd}>Agregar Producto</button>
      <button onClick={() => navigate(-1)}>Volver</button>

      {/* Tabla de productos */}
      <table border="1">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="text_black">{product.name}</td>
              <td className="text_black">${product.price}</td>
              <td className="text_black">{product.stock}</td>
              <td className="img_producto">
                {product.image ? <img src={product.image} width="80" height="80" /> : "La imagen no existe"}
              </td>
              <td>
                <button className="button edit" onClick={() => openModalForEdit(product)}>Editar</button>
                <button className="button delete" onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para agregar/editar producto */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="h1_title">{isEditing ? "Editar Producto" : "Agregar Producto"}</h2>
            <form onSubmit={handleSaveProduct}>
              <input 
                className="input" 
                type="text" 
                placeholder="Nombre" 
                value={isEditing ? productEditando.name : productForm.name} 
                onChange={(e) => isEditing ? setProductEditando({ ...productEditando, name: e.target.value }) : setProductForm({ ...productForm, name: e.target.value })}
                required 
              />
              <br />
              <textarea 
                className="textarea" 
                placeholder="Descripción" 
                value={isEditing ? productEditando.description : productForm.description} 
                onChange={(e) => isEditing ? setProductEditando({ ...productEditando, description: e.target.value }) : setProductForm({ ...productForm, description: e.target.value })}
              />
              <br />
              <input 
                className="input" 
                type="number" 
                placeholder="Precio" 
                value={isEditing ? productEditando.price : productForm.price} 
                onChange={(e) => isEditing ? setProductEditando({ ...productEditando, price: e.target.value }) : setProductForm({ ...productForm, price: e.target.value })}
                required 
              />
              <br />
              <input 
                className="input" 
                type="number" 
                placeholder="Stock" 
                value={isEditing ? productEditando.stock : productForm.stock} 
                onChange={(e) => isEditing ? setProductEditando({ ...productEditando, stock: e.target.value }) : setProductForm({ ...productForm, stock: e.target.value })}
                required 
              />
              <br />
              <input 
                className="input" 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (isEditing) {
                        setProductEditando({ ...productEditando, image: reader.result });
                      } else {
                        setProductForm({ ...productForm, image: reader.result });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <br />
              <button type="submit">{isEditing ? "Guardar Cambios" : "Agregar Producto"}</button>
              <br />
              <button onClick={() => setModalOpen(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
