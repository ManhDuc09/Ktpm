
import { render, screen, fireEvent } from "@testing-library/react";
import ProductForm from "../components/ProductForm";
import "@testing-library/jest-dom";

function fillForm(values) {
  Object.entries(values).forEach(([placeholder, value]) => {
    fireEvent.change(
      screen.getByPlaceholderText(new RegExp(placeholder, "i")),
      { target: { value } }
    );
  });
}

describe("ProductForm Component - Validation", () => {
  it("TC1: Hiển thị lỗi khi tên sản phẩm rỗng", () => {
    render(<ProductForm />);
    fillForm({
      "Tên sản phẩm": "",
      Giá: "100",
      "Số lượng": "5",
      "Mô tả": "Mô tả hợp lệ",
      "Danh mục": "Drink",
    });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(
      screen.getByText(/Tên sản phẩm không được để trống/i)
    ).toBeInTheDocument();
  });

  it("TC2: Hiển thị lỗi khi tên sản phẩm quá ngắn", () => {
    render(<ProductForm />);
    fillForm({
      "Tên sản phẩm": "A",
      Giá: "100",
      "Số lượng": "5",
      "Mô tả": "Mô tả hợp lệ",
      "Danh mục": "Drink",
    });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(
      screen.getByText(/Tên sản phẩm phải từ 3 đến 20 ký tự/i)
    ).toBeInTheDocument();
  });

  it("TC3: Hiển thị lỗi khi tên sản phẩm quá dài", () => {
    render(<ProductForm />);
    fillForm({
      "Tên sản phẩm": "A".repeat(21),
      Giá: "100",
      "Số lượng": "5",
      "Mô tả": "Mô tả hợp lệ",
      "Danh mục": "Drink",
    });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(
      screen.getByText(/Tên sản phẩm phải từ 3 đến 20 ký tự/i)
    ).toBeInTheDocument();
  });

  it("TC4: Hiển thị lỗi khi giá <= 0", () => {
    render(<ProductForm />);
    fillForm({
      "Tên sản phẩm": "Sản phẩm A",
      Giá: "0",
      "Số lượng": "5",
      "Mô tả": "Mô tả hợp lệ",
      "Danh mục": "Drink",
    });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(screen.getByText(/Giá phải lớn hơn 0/i)).toBeInTheDocument();
  });

  it("TC5: Hiển thị lỗi khi giá vượt 1.000.000", () => {
    render(<ProductForm />);
    fillForm({
      "Tên sản phẩm": "Sản phẩm A",
      Giá: "1000001",
      "Số lượng": "5",
      "Mô tả": "Mô tả hợp lệ",
      "Danh mục": "Drink",
    });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(
      screen.getByText(/Giá không vượt quá 1.000.000/i)
    ).toBeInTheDocument();
  });

  it("TC6: Hiển thị lỗi khi số lượng âm", () => {
    render(<ProductForm />);
    fillForm({
      "Tên sản phẩm": "Sản phẩm A",
      Giá: "100",
      "Số lượng": "-5",
      "Mô tả": "Mô tả hợp lệ",
      "Danh mục": "Drink",
    });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(screen.getByText(/Số lượng phải >= 0/i)).toBeInTheDocument();
  });

  it("TC7: Hiển thị lỗi khi mô tả vượt 200 ký tự", () => {
    render(<ProductForm />);
    fillForm({
      "Tên sản phẩm": "Sản phẩm A",
      Giá: "100",
      "Số lượng": "5",
      "Mô tả": "a".repeat(201),
      "Danh mục": "Drink",
    });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(screen.getByText(/Mô tả tối đa 200 ký tự/i)).toBeInTheDocument();
  });

  it("TC8: Hiển thị lỗi khi danh mục rỗng", () => {
    render(<ProductForm />);
    fillForm({
      "Tên sản phẩm": "Sản phẩm A",
      Giá: "100",
      "Số lượng": "5",
      "Mô tả": "Mô tả hợp lệ",
      "Danh mục": "",
    });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(
      screen.getByText(/Danh mục không được để trống/i)
    ).toBeInTheDocument();
  });

  it("TC9: Submit thành công khi dữ liệu hợp lệ", () => {
    const handleSubmit = jest.fn();
    render(<ProductForm onSubmit={handleSubmit} />);
    fillForm({
      "Tên sản phẩm": "Trà sữa",
      Giá: "30000",
      "Số lượng": "5",
      "Mô tả": "Món ngon",
      "Danh mục": "Đồ uống",
    });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Trà sữa",
      price: "30000",
      quantity: "5",
      description: "Món ngon",
      category: "Đồ uống",
    });
  });
});
