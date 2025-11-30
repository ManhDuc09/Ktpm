// src/services/validation.test.js
import { validateProduct } from "./validation";

describe("validateProduct()", () => {
  it("Sản phẩm không được để trống", () => {
    const product = { name: "" };
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Tên sản phẩm không được để trống");
  });

  it("Tên sản phẩm phải từ 3 đến 20 ký tự", () => {
    const product = { name: "ab" };
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Tên sản phẩm phải từ 3 đến 20 ký tự");
  });

  it("Sản phẩm phải từ 3 đến 20 ký tự"),
    () => {
      const product = { name: "a".repeat(21) };
      const result = validateProduct(product);
      expect(result.valid).toBe(false);
      expect(result.message).toBe("Sản phẩm phải từ 3 đến 20 ký tự");
    };

  it("Giá phải là số >= 0", () => {
    const product = { name: "A", price: -1 };
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Giá phải là số >= 0");
  });

  it("Số lượng phải là số nguyên >= 0", () => {
    const product = { name: "A", quantity: -2 };
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Số lượng phải là số nguyên >= 0");
  });

  it("Mô tả không được vượt quá 200 ký tự", () => {
    const longDesc = "a".repeat(201);
    const product = { name: "A", description: longDesc };
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Mô tả tối đa 200 ký tự");
  });

  it("Category không hợp lệ", () => {
    const product = { name: "A", category: "Unknown" };
    const result = validateProduct(product);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Category không hợp lệ");
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
    expect(Object.keys(result.message)).toHaveLength(0);
  });
});
