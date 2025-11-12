import React, { useState } from "react";
import "./UserPage.css";

const UserPage = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    ]);

    const [modalData, setModalData] = useState({ id: null, name: "", email: "", role: "" });
    const [isEdit, setIsEdit] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const openCreateModal = () => {
        setIsEdit(false);
        setModalData({ id: null, name: "", email: "", role: "" });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setIsEdit(true);
        setModalData(user);
        setShowModal(true);
    };

    const handleChange = (e) => {
        setModalData({ ...modalData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (isEdit) {
            setUsers(users.map(u => u.id === modalData.id ? modalData : u));
        } else {
            setUsers([...users, { ...modalData, id: Date.now() }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure?")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const closeModal = () => setShowModal(false);

    return (
        <div className="user-container">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2>User Management</h2>
                <button className="btn btn-danger">Logout</button>
            </header>

            <button className="btn btn-primary mb-3" onClick={openCreateModal}>
                Add User
            </button>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(u)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content p-3">
                        <h5>{isEdit ? "Edit User" : "Add User"}</h5>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={modalData.name}
                            onChange={handleChange}
                            className="form-control my-2"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={modalData.email}
                            onChange={handleChange}
                            className="form-control my-2"
                        />
                        <input
                            type="text"
                            name="role"
                            placeholder="Role"
                            value={modalData.role}
                            onChange={handleChange}
                            className="form-control my-2"
                        />
                        <div className="d-flex justify-content-end mt-2">
                            <button className="btn btn-secondary me-2" onClick={closeModal}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
