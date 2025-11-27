import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./UserPage.css";

const UserPage = () => {
    let { id } = useParams(); // user id from URL
    id = Number(id); // Đảm bảo id là số
    const [products, setProducts] = useState([]);
    const [modalData, setModalData] = useState({ id: null, title: "", description: "", quantity: 0 });
    const [isEdit, setIsEdit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [titleError, setTitleError] = useState("");
    const [quantityError, setQuantityError] = useState("");

    // Fetch products for this user
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products/${id}`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        if (id) fetchProducts();
    }, [id]);

    // Open modals
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
        setTitleError("");
        setQuantityError("");
        if (!modalData.title || modalData.title.trim() === "") {
            setTitleError("Title is required");
            return;
        }
        if (modalData.quantity < 0) {
            setQuantityError("Quantity must be >= 0");
            return;
        }
        try {
            if (isEdit) {
                // Update product
                const response = await axios.put(
                    `http://localhost:8080/api/products/${modalData.id}`,
                    modalData
                );
                setProducts(products.map(p => (p.id === modalData.id ? response.data : p)));
            } else {
                // Create new product
                const response = await axios.post(
                    `http://localhost:8080/api/products/${id}`,
                    modalData
                );
                setProducts([...products, response.data]);
            }
            setShowModal(false);
        } catch (error) {
            if (error.response && error.response.data && typeof error.response.data === "string") {
                if (error.response.data.includes("title")) {
                    setTitleError("Title is required");
                } else if (error.response.data.includes("quantity")) {
                    setQuantityError("Quantity must be >= 0");
                } else {
                    alert("Failed to save product.");
                }
            } else {
                alert("Failed to save product.");
            }
            console.error("Error saving product:", error);
        }
    };

    // Delete product
    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/products/${productId}`);
            setProducts(products.filter(p => p.id !== productId));
        } catch (error) {
            if (
                error.response &&
                error.response.status === 404 &&
                typeof error.response.data === "string" &&
                error.response.data.includes("not found")
            ) {
                alert("Product not found");
            } else {
                alert("Failed to delete product.");
            }
            console.error("Error deleting product:", error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    }

    return (
        <div className="user-container">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Management</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </header>

            <button className="btn btn-primary mb-3" onClick={openCreateModal}>
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
                            <tr key={p.id}>
                                <td>{p.title}</td>
                                <td>{p.description}</td>
                                <td>{p.quantity}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => openEditModal(p)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No items yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal */}
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
                        />
                        {titleError && (
                            <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{titleError}</div>
                        )}
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={modalData.description}
                            onChange={handleChange}
                            className="form-control my-2"
                        />
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={modalData.quantity}
                            onChange={handleChange}
                            className="form-control my-2"
                        />
                        {quantityError && (
                            <div style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>{quantityError}</div>
                        )}
                        <div className="d-flex justify-content-end mt-2">
                            <button className="btn btn-secondary me-2" onClick={closeModal}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
