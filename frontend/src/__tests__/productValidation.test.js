// src/__tests__/productValidation.test.js
import { validateProduct } from "../services/productValidation";

describe("validateProduct()", () => {
  it("Sản phẩm không được để trống", () => {
    const product = { name: "" };
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Tên sản phẩm không được để trống");
  });

  it("Tên sản phẩm phải từ 3 đến 20 ký tự (quá ngắn)", () => {
    const product = { name: "ab" }; // too short
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Tên sản phẩm phải từ 3 đến 20 ký tự");
  });

  it("Tên sản phẩm phải từ 3 đến 20 ký tự (quá dài)", () => {
    const product = { name: "a".repeat(21) }; // too long
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Tên sản phẩm phải từ 3 đến 20 ký tự");
  });

  it("Giá phải lớn hơn 0", () => {
    const product = { name: "Valid Name", price: 0 }; // valid name
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Giá phải lớn hơn 0");
  });

  it("Giá không vượt quá 1.000.000", () => {
    const product = { name: "Valid Name", price: 1000001 }; // valid name
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Giá không vượt quá 1.000.000");
  });

  it("Số lượng phải >= 0", () => {
    const product = { name: "Valid Name", price: 10, quantity: -2 };
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Số lượng phải >= 0");
  });

  it("Mô tả không được vượt quá 200 ký tự", () => {
    const longDesc = "a".repeat(201);
    const product = {
      name: "Valid Name",
      price: 10,
      quantity: 5,
      description: longDesc,
    };
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Mô tả tối đa 200 ký tự");
  });

  it("Danh mục không được để trống", () => {
    const product = {
      name: "Valid Name",
      price: 10,
      quantity: 5,
      category: "",
    };
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Danh mục không được để trống");
  });

  it("Sản phẩm hợp lệ", () => {
    const product = {
      name: "Tea",
      price: 10,
      quantity: 5,
      description: "Good",
      category: "Drink",
    };
    const result = validateProduct(product);
    expect(result.valid).toBe(true);
    expect(result.message).toBe("");
  });
});
