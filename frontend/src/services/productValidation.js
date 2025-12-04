export function validateProduct(product) {
  const rules = [
    {
      check: () => !product.name || product.name.trim() === "",
      message: "Tên sản phẩm không được để trống",
    },
    {
      check: () => product.name.length < 3 || product.name.length > 20,
      message: "Tên sản phẩm phải từ 3 đến 20 ký tự",
    },
    { check: () => product.price <= 0, message: "Giá phải lớn hơn 0" },
    {
      check: () => product.price > 1000000,
      message: "Giá không vượt quá 1.000.000",
    },
    { check: () => product.quantity < 0, message: "Số lượng phải >= 0" },
    {
      check: () => product.description && product.description.length > 200,
      message: "Mô tả tối đa 200 ký tự",
    },
    {
      check: () => !product.category || product.category.trim() === "",
      message: "Danh mục không được để trống",
    },
  ];
  for (const rule of rules) {
    if (rule.check()) return { valid: false, message: rule.message };
  }
  return { valid: true, message: "" };
}
