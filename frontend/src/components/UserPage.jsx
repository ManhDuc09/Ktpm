import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as ProductService from "../services/ProductService"; // Use ProductService
import "./UserPage.css";

const UserPage = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [modalData, setModalData] = useState({ id: null, title: "", description: "", quantity: 0 });
    const [isEdit, setIsEdit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "" });

    // Fetch products on mount
    useEffect(() => {
        if (id) fetchProducts();
    }, [id]);

    const fetchProducts = async () => {
        try {
            const response = await ProductService.getProducts(id);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
    };

    const openCreateModal = () => {
        setIsEdit(false);
        setModalData({ id: null, title: "", description: "", quantity: 0 });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setIsEdit(true);
        setModalData(product);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleChange = (e) => {
        setModalData({ ...modalData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            let response;
            if (isEdit) {
                response = await ProductService.updateProduct(modalData.id, modalData);
                setProducts(products.map(p => (p.id === modalData.id ? response.data : p)));
                showToast("Product updated successfully!");
            } else {
                response = await ProductService.createProduct(id, modalData);
                setProducts([...products, response.data]);
                showToast("Product created successfully!");
            }
            setShowModal(false);
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product.");
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await ProductService.deleteProduct(productId);
            setProducts(products.filter(p => p.id !== productId));
            showToast("Product deleted successfully!");
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <div className="user-container">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Management</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </header>

            {toast.show && (
                <div data-testid="success-message" className="toast-notification">
                    {toast.message}
                </div>
            )}

            <button className="btn btn-primary mb-3" onClick={openCreateModal} data-testid="add-product-btn">
                Add Product
            </button>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map(p => (
                            <tr key={p.id} data-testid="product-item">
                                <td>{p.title}</td>
                                <td>{p.description}</td>
                                <td>{p.quantity}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        data-testid="edit-btn"
                                        onClick={() => openEditModal(p)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        data-testid="delete-btn"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No items yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content p-3">
                        <h5>{isEdit ? "Edit Product" : "Add Product"}</h5>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={modalData.title}
                            onChange={handleChange}
                            className="form-control my-2"
                            data-testid="product-name"
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={modalData.description}
                            onChange={handleChange}
                            className="form-control my-2"
                            data-testid="product-description"
                        />
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={modalData.quantity}
                            onChange={handleChange}
                            className="form-control my-2"
                            data-testid="product-quantity"
                        />
                        <div className="d-flex justify-content-end mt-2">
                            <button className="btn btn-secondary me-2" onClick={closeModal}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave} data-testid="submit-btn">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;