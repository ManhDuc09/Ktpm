import { validateUsername, validatePassword } from "../services/validation";
describe("validateUsername()", () => {
  it("TC1: Username rỗng", () => {
    const r = validateUsername("");
    expect(r.valid).toBe(false);
    expect(r.message).toBe("Username không được để trống");
  });

  it("TC2: Username quá ngắn", () => {
    const r = validateUsername("ab");
    expect(r.valid).toBe(false);
    expect(r.message).toBe("Username quá ngắn hoặc quá dài");
  });

  it("TC3: Username quá dài", () => {
    const r = validateUsername("a".repeat(25));
    expect(r.valid).toBe(false);
    expect(r.message).toBe("Username quá ngắn hoặc quá dài");
  });

  it("TC4: Username chứa ký tự đặc biệt", () => {
    const r = validateUsername("user@123");
    expect(r.valid).toBe(false);
    expect(r.message).toBe("Username chứa ký tự không hợp lệ");
  });

  it("TC10: Username hợp lệ", () => {
    const r = validateUsername("user123");
    expect(r.valid).toBe(true);
  });
});

describe("validatePassword()", () => {
  it("TC5: Password rỗng", () => {
    const r = validatePassword("");
    expect(r.valid).toBe(false);
    expect(r.message).toBe("Password không được để trống");
  });

  it("TC6: Password quá ngắn", () => {
    const r = validatePassword("ab");
    expect(r.valid).toBe(false);
    expect(r.message).toBe("Password quá ngắn hoặc quá dài");
  });

  it("TC7: Password quá dài", () => {
    const r = validatePassword("a1".repeat(25));
    expect(r.valid).toBe(false);
    expect(r.message).toBe("Password quá ngắn hoặc quá dài");
  });

  it("TC8: Password không chứa chữ cái", () => {
    const r = validatePassword("12345678");
    expect(r.valid).toBe(false);
    expect(r.message).toBe("Password phải chứa chữ");
  });

  it("TC9: Password không chứa số", () => {
    const r = validatePassword("abcdefgh");
    expect(r.valid).toBe(false);
    expect(r.message).toBe("Password phải chứa số");
  });

  it("TC10: Password hợp lệ", () => {
    const r = validatePassword("abc123");
    expect(r.valid).toBe(true);
  });
});
