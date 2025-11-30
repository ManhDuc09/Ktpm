import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

export const getProducts = (userId) => axios.get(`${API_URL}/${userId}`);
export const createProduct = (userId, productData) => axios.post(`${API_URL}/${userId}`, productData);
export const updateProduct = (productId, productData) => axios.put(`${API_URL}/${productId}`, productData);
export const deleteProduct = (productId) => axios.delete(`${API_URL}/${productId}`);
