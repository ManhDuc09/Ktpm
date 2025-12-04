// src/services/validation.js (username)
export function validateUsername(username) {
  const empty = !username || username.trim() === "";
  const invalidLength = username.length < 3 || username.length > 20;
  const invalidChars = !/^[a-zA-Z0-9_]+$/.test(username);

  if (empty) return { valid: false, message: "Username không được để trống" };

  if (invalidLength)
    return { valid: false, message: "Username quá ngắn hoặc quá dài" };

  if (invalidChars)
    return { valid: false, message: "Username chứa ký tự không hợp lệ" };

  return { valid: true };
}
// src/services/validation.js (password)
export function validatePassword(password) {
  const empty = !password;
  const invalidLength = password.length < 6 || password.length > 20;
  const missingLetter = !/[a-zA-Z]/.test(password);
  const missingNumber = !/[0-9]/.test(password);

  if (empty) return { valid: false, message: "Password không được để trống" };

  if (invalidLength)
    return { valid: false, message: "Password quá ngắn hoặc quá dài" };

  if (missingLetter) return { valid: false, message: "Password phải chứa chữ" };

  if (missingNumber) return { valid: false, message: "Password phải chứa số" };

  return { valid: true };
}

// // src/services/validation.js (email)
// export function validateEmail(email) {
//   if (!email || email.trim() === "") {
//     return { valid: false, message: "Email không được để trống" };
//   }

//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     return { valid: false, message: "Email không hợp lệ" };
//   }

//   return { valid: true, message: "" };
// }
