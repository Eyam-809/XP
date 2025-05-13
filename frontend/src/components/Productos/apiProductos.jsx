import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/products";

// Función para obtener productos filtrados por el id_user
export const getProducts = (idUser) => axios.get(API_URL, { params: { id_user: idUser } });

// Función para agregar un producto
export const addProduct = (product) => axios.post(API_URL, product);

// Función para actualizar un producto
export const updateProduct = (id, product) => axios.put(`${API_URL}/${id}`, product);

// Función para eliminar un producto
export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);
