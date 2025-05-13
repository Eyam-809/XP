import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../Productos/apiProductos";

function ProductosLista() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const response = await getProducts();
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts(); // Recargar lista
  };

  return (
    <div>
      <h2>Lista de Productos</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th> {/* Nueva columna para la imagen */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                {/* Mostrar la imagen solo si existe */}
                {product.image && <img src={product.image} alt={product.name} width="50" height="50" />}
              </td>
              <td>
                <button onClick={() => handleDelete(product.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductosLista;
