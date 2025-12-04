import { useState } from "react";
import { validateProduct } from "../services/productValidation";

export default function ProductForm({ onSubmit }) {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    category: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateProduct(product);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setError("");
    onSubmit && onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={product.name}
        onChange={handleChange}
        placeholder="Tên sản phẩm"
      />
      <input
        name="price"
        value={product.price}
        onChange={handleChange}
        placeholder="Giá"
      />
      <input
        name="quantity"
        value={product.quantity}
        onChange={handleChange}
        placeholder="Số lượng"
      />
      <input
        name="description"
        value={product.description}
        onChange={handleChange}
        placeholder="Mô tả"
      />
      <input
        name="category"
        value={product.category}
        onChange={handleChange}
        placeholder="Danh mục"
      />
      {error && <span>{error}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
