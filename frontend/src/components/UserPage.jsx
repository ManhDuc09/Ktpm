
import React, { useState } from "react";
import "./UserPage.css";

const initialProducts = [
    { id: 1, title: "Laptop", description: "Gaming laptop", quantity: 5 },
    { id: 2, title: "Mouse", description: "Wireless mouse", quantity: 12 },
    { id: 3, title: "Keyboard", description: "Mechanical keyboard", quantity: 7 },
];

function UserPage() {
    const [products, setProducts] = useState(initialProducts);

    const handleEdit = (id) => {
        alert(`Edit product with id: ${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((product) => product.id !== id));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <div className="product-container">
            <header>
                <h2>Product Management</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </header>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.title}</td>
                            <td>{product.description}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(product.id)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



export default UserPage;
