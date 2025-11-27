# ĐỒ ÁN KIỂM THỬ PHẦN MỀM

**TRƯỜNG ĐẠI HỌC SÀI GÒN**  
**KHOA CÔNG NGHỆ THÔNG TIN**

---

## ĐỒ ÁN KIỂM THỬ PHẦN MỀM

**Đề tài:** PHÂN TÍCH VÀ THIẾT KẾ TEST CASES  
CHO HỆ THỐNG QUẢN LÝ NGƯỜI DÙNG VÀ SẢN PHẨM

**Môn học:** Kiểm Thử Phần Mềm  
**Niên khóa:** 2024-2025  
**Học kỳ:** 1

---

# MỤC LỤC

1. CÂU 1.1: PHÂN TÍCH VÀ TEST LOGIN
2. CÂU 1.2: PHÂN TÍCH VÀ TEST PRODUCT MANAGEMENT
3. KẾT LUẬN VÀ KHUYẾN NGHỊ

---

# CÂU 1.1: PHÂN TÍCH VÀ TEST LOGIN (10 ĐIỂM)

## 1.1.1 Phân tích yêu cầu chức năng (2 điểm)

### A. Validation Rules cho Email (Username)

Hệ thống sử dụng **email** làm username với các quy tắc sau:

| Tiêu chí | Yêu cầu | Mô tả chi tiết |
|----------|---------|----------------|
| **Định dạng** | Email hợp lệ | Phải tuân thủ format email chuẩn (RFC 5322): local@domain.ext |
| **Độ dài** | 3-50 ký tự | Min: 3 ký tự (a@b.c), Max: 50 ký tự |
| **Ký tự cho phép** | a-z, A-Z, 0-9, -, ., _ | Local part: chữ cái, số, dấu chấm, gạch ngang, gạch dưới |
| **Bắt buộc** | Required | Không được để trống hoặc null |
| **Case sensitivity** | Case-insensitive | Test@mail.com = test@mail.com |

**Frontend validation (LoginPage.jsx):**
- Required field check: if (!loginData.email)
- HTML5 email validation: type="email"
- Empty string check

**Backend validation (UserService.java):**
- Email existence check: userRepository.findByEmail(email)
- Database query case-insensitive

### B. Validation Rules cho Password

| Tiêu chí | Yêu cầu | Mô tả chi tiết |
|----------|---------|----------------|
| **Độ dài** | 6-100 ký tự | Min: 6 ký tự (password tối thiểu), Max: 100 ký tự |
| **Thành phần** | Phải có chữ và số | Ít nhất 1 chữ cái (a-z hoặc A-Z), Ít nhất 1 chữ số (0-9) |
| **Bắt buộc** | Required | Không được để trống hoặc null |
| **Mã hóa** | BCrypt | Hash password trước khi lưu vào DB |
| **Case sensitivity** | Case-sensitive | Password123 ≠ password123 |

### C. Authentication Flow

1. **User Input:** Nhập email và password
2. **Frontend Validation:** Kiểm tra required, format email
3. **API Request:** POST /api/users/login với credentials
4. **Backend Authentication:**
   - Tìm user theo email: userRepository.findByEmail()
   - Nếu không tìm thấy → 401 Unauthorized
   - Kiểm tra password với BCrypt: passwordEncoder.matches()
   - Nếu sai password → 401 Unauthorized
   - Nếu đúng → 200 OK, trả về user object
5. **Response Handling:**
   - Success: Lưu user vào localStorage, redirect đến /users/{id}
   - Error: Hiển thị "Invalid email or password!"

### D. Error Handling

**Frontend errors:**
- Empty fields → "Both email and password are required!"
- 401 Unauthorized → "Invalid email or password!"
- Network error → "Network error"

**Backend errors:**
- User not found → 401 Unauthorized
- Wrong password → 401 Unauthorized
- Server error → 500 Internal Server Error

**Security considerations:**
- Không tiết lộ thông tin cụ thể (email tồn tại hay không)
- Unified error message để prevent username enumeration
- BCrypt secure password comparison

---

## 1.1.2 Danh sách 10 Test Scenarios (2 điểm)

| ID | Test Scenario | Category | Priority |
|----|---------------|----------|----------|
| TS_LOGIN_01 | Đăng nhập thành công với credentials hợp lệ | Happy Path | Critical |
| TS_LOGIN_02 | Đăng nhập với email rỗng | Negative Test | High |
| TS_LOGIN_03 | Đăng nhập với password rỗng | Negative Test | High |
| TS_LOGIN_04 | Đăng nhập với email không đúng format | Negative Test | High |
| TS_LOGIN_05 | Đăng nhập với email không tồn tại | Negative Test | Critical |
| TS_LOGIN_06 | Đăng nhập với password sai | Negative Test | Critical |
| TS_LOGIN_07 | Đăng nhập với password dưới min length (<6 ký tự) | Boundary Test | High |
| TS_LOGIN_08 | Đăng nhập với email có khoảng trắng đầu/cuối | Edge Case | Medium |
| TS_LOGIN_09 | Đăng nhập với password có ký tự đặc biệt | Edge Case | Medium |
| TS_LOGIN_10 | Đăng nhập với email ở giới hạn min/max (3/50 ký tự) | Boundary Test | Medium |

### Mô tả chi tiết từng Test Scenario:

**TS_LOGIN_01: Đăng nhập thành công**
- Preconditions: User đã có account (testuser@gmail.com / Test123456)
- Steps: Nhập đúng email và password, click Sign In
- Expected: HTTP 200, user data lưu localStorage, redirect /users/{id}

**TS_LOGIN_02-03: Email/Password rỗng**
- Preconditions: User on login page
- Steps: Để trống email hoặc password, click Sign In
- Expected: Error "Both email and password are required!", không gọi API

**TS_LOGIN_04: Email sai format**
- Test data: notanemail, user@, @domain.com
- Expected: HTML5 validation error hoặc custom error message

**TS_LOGIN_05-06: Email không tồn tại / Password sai**
- Expected: HTTP 401, error "Invalid email or password!"
- Security: Không phân biệt email vs password error

**TS_LOGIN_07: Password < 6 ký tự**
- Test data: abc12 (5 chars)
- Expected: Frontend validation error hoặc 401

**TS_LOGIN_08: Email có spaces**
- Test data: " testuser@gmail.com "
- Expected: Auto-trim hoặc validation error

**TS_LOGIN_09: Password với ký tự đặc biệt**
- Test data: Pass@123!$
- Expected: System accepts, BCrypt matches, login thành công

**TS_LOGIN_10: Email boundary**
- Test data: a@b.c (3 chars), email 50 chars
- Expected: Accept valid boundary values

---

## 1.1.3 Phân loại theo mức độ ưu tiên (1 điểm)

### Critical Priority (3 scenarios - 30%)
- TS_LOGIN_01: Core functionality, block toàn bộ app
- TS_LOGIN_05: Security critical, prevent enumeration
- TS_LOGIN_06: Authentication core, frequent failure

### High Priority (4 scenarios - 40%)
- TS_LOGIN_02, 03: Basic validation, prevent API abuse
- TS_LOGIN_04: Data integrity, format compliance
- TS_LOGIN_07: Security requirement, password policy

### Medium Priority (3 scenarios - 30%)
- TS_LOGIN_08, 09, 10: Edge cases, UX improvements

**Testing Strategy:**
- Test Critical first → automated CI/CD
- High priority → smoke tests
- Medium → full regression

---

## 1.1.4 Thiết kế 5 Test Cases chi tiết (5 điểm)

### TC_LOGIN_001: Đăng nhập thành công

| Field | Details |
|-------|---------|
| **Test Case ID** | TC_LOGIN_001 |
| **Priority** | Critical |
| **Preconditions** | User account exists: testuser@gmail.com / Test123456 (BCrypt hash) |
| **Test Steps** | **Step 1:** Navigate to http://localhost:5173/ <br> **Step 2:** Enter email: testuser@gmail.com <br> **Step 3:** Enter password: Test123456 <br> **Step 4:** Click "Sign In" button |
| **Test Data** | **Email:** testuser@gmail.com <br> **Password:** Test123456 |
| **Expected Result** | **API Response:** <br> • HTTP Status: 200 OK <br> • Body: {id, name, email, password(hashed)} <br><br> **Frontend Behavior:** <br> • localStorage.setItem("user", ...) <br> • Redirect to /users/1 <br> • Dashboard displayed <br> • User name shown in header |
| **Actual Result** | *(To be filled during execution)* |
| **Status** | ☐ Not Run  ☐ Pass  ☐ Fail |

### TC_LOGIN_002: Email không tồn tại

| Field | Details |
|-------|---------|
| **Test Case ID** | TC_LOGIN_002 |
| **Priority** | Critical |
| **Preconditions** | Email nonexistent@gmail.com NOT in database |
| **Test Steps** | **Step 1:** Navigate to login page <br> **Step 2:** Enter email: nonexistent@gmail.com <br> **Step 3:** Enter password: AnyPass123 <br> **Step 4:** Click Sign In |
| **Test Data** | **Email:** nonexistent@gmail.com <br> **Password:** AnyPass123 |
| **Expected Result** | **API Request:** <br> • POST /api/users/login <br> • HTTP 401 Unauthorized <br><br> **Frontend:** <br> • Error: "Invalid email or password!" <br> • No localStorage update <br> • Stay on login page <br><br> **Security:** Same error as wrong password |
| **Actual Result** | *(To be filled during execution)* |
| **Status** | ☐ Not Run  ☐ Pass  ☐ Fail |

### TC_LOGIN_003: Password sai

| Field | Details |
|-------|---------|
| **Test Case ID** | TC_LOGIN_003 |
| **Priority** | Critical |
| **Preconditions** | User exists: testuser@gmail.com, correct password: Test123456 |
| **Test Steps** | 1. Enter email: testuser@gmail.com<br>2. Enter password: WrongPassword123<br>3. Click Sign In |
| **Expected Result** | - User found by email<br>- BCrypt match fails<br>- HTTP 401<br>- Error: "Invalid email or password!"<br>- Identical to TC_LOGIN_002 (security) |
| **Test Data** | Email: testuser@gmail.com<br>Password: WrongPassword123 (incorrect) |

### TC_LOGIN_004: Cả email và password rỗng

| Field | Details |
|-------|---------|
| **Test Case ID** | TC_LOGIN_004 |
| **Priority** | High |
| **Preconditions** | User on login page |
| **Test Steps** | 1. Leave email empty<br>2. Leave password empty<br>3. Click Sign In |
| **Expected Result** | - Client validation triggered<br>- Error: "Both email and password are required!"<br>- NO API call<br>- Stay on login page |
| **Test Data** | Email: "" (empty)<br>Password: "" (empty) |

### TC_LOGIN_005: Email sai định dạng

| Field | Details |
|-------|---------|
| **Test Case ID** | TC_LOGIN_005 |
| **Priority** | High |
| **Preconditions** | User on login page |
| **Test Steps** | 1. Enter invalid email: notanemail<br>2. Enter password: Test123456<br>3. Attempt to click Sign In |
| **Expected Result** | - HTML5 validation error<br>- Browser message: "Please include '@' in email"<br>- Form submission blocked<br>- No API call |
| **Test Data** | Invalid formats: notanemail, user@, @domain.com |

---

# CÂU 1.2: PHÂN TÍCH VÀ TEST PRODUCT MANAGEMENT (10 ĐIỂM)

## 1.2.1 Phân tích yêu cầu CRUD (2 điểm)

### A. CREATE - Thêm sản phẩm mới

**Endpoint:** POST /api/products/{userId}

**Validation Rules:**

| Field | Rule | Description |
|-------|------|-------------|
| **Title** | 3-100 ký tự | Required, không được rỗng, trim spaces |
| **Description** | ≤500 ký tự | Optional, có thể rỗng |
| **Quantity** | 0-99,999 | Integer, non-negative, min=0 (out of stock OK) |
| **User ID** | Must exist | Foreign key, user phải tồn tại trong DB |

**Flow:**
1. Frontend validate title, quantity
2. API call POST /api/products/{userId}
3. Backend tìm user: userService.findById()
4. Nếu user không tồn tại → 404 "User not found"
5. Tạo product mới, link với user
6. Save vào DB
7. Response 201 Created + product object

### B. READ - Xem danh sách sản phẩm

**Endpoint:** GET /api/products/{userId}

**Behavior:**
- Lấy tất cả products của user cụ thể
- Filter by userId
- Return list products hoặc empty list []
- No pagination (cần thêm nếu nhiều products)

### C. UPDATE - Cập nhật sản phẩm

**Endpoint:** PUT /api/products/{productId}

**Validation:** Same as CREATE (title 3-100, quantity 0-99999)

**⚠️ SECURITY ISSUE:**
- Hiện tại KHÔNG kiểm tra ownership
- User A có thể update product của User B
- **Khuyến nghị:** Thêm check product.user.id == currentUser.id

### D. DELETE - Xóa sản phẩm

**Endpoint:** DELETE /api/products/{productId}

**⚠️ SECURITY ISSUE:**
- Hiện tại KHÔNG kiểm tra ownership
- User A có thể xóa product của User B
- **Khuyến nghị:** Thêm check ownership trước khi xóa

---

## 1.2.2 Danh sách 10 Test Scenarios (2 điểm)

| ID | Test Scenario | Category | Priority |
|----|---------------|----------|----------|
| TS_PRODUCT_01 | Tạo sản phẩm mới thành công | Happy Path | Critical |
| TS_PRODUCT_02 | Xem danh sách sản phẩm của user | Happy Path | Critical |
| TS_PRODUCT_03 | Cập nhật sản phẩm thành công | Happy Path | Critical |
| TS_PRODUCT_04 | Xóa sản phẩm thành công | Happy Path | Critical |
| TS_PRODUCT_05 | Tạo sản phẩm với title rỗng | Negative Test | High |
| TS_PRODUCT_06 | Tạo sản phẩm với quantity âm | Negative Test | High |
| TS_PRODUCT_07 | Tạo với title dưới min (< 3 ký tự) | Boundary Test | High |
| TS_PRODUCT_08 | Tạo với title = 3 ký tự (min boundary) | Boundary Test | Medium |
| TS_PRODUCT_09 | Tạo với title = 100 ký tự (max boundary) | Boundary Test | Medium |
| TS_PRODUCT_10 | Update product của user khác (security) | Security Test | Critical |

### Mô tả chi tiết:

**TS_PRODUCT_01: Tạo sản phẩm thành công**
- Steps: Nhập title "Laptop", description "Dell", quantity 10, click Add
- Expected: POST /api/products/1, HTTP 201, product added to list

**TS_PRODUCT_02: Xem danh sách**
- Steps: Load user page
- Expected: GET /api/products/1, display all user's products

**TS_PRODUCT_03: Cập nhật thành công**
- Steps: Click edit, change title to "Laptop Pro", save
- Expected: PUT /api/products/{id}, HTTP 200, product updated

**TS_PRODUCT_04: Xóa thành công**
- Steps: Click delete, confirm
- Expected: DELETE /api/products/{id}, HTTP 200, product removed

**TS_PRODUCT_05: Title rỗng**
- Steps: Nhập title "", quantity 10, click Add
- Expected: Frontend validation error "Title is required"

**TS_PRODUCT_06: Quantity âm**
- Steps: Nhập quantity -5
- Expected: Validation error "Quantity must be non-negative"

**TS_PRODUCT_07: Title < 3 ký tự**
- Test data: "AB" (2 chars)
- Expected: Error "Title must be at least 3 characters"

**TS_PRODUCT_08-09: Boundary values**
- Test 3 chars: "ABC" → Accept
- Test 100 chars: Accept
- Test 101 chars → Reject

**TS_PRODUCT_10: Security test**
- Steps: User A tries to update User B's product
- Expected: Should return 403 Forbidden (currently missing!)

---

## 1.2.3 Phân loại theo ưu tiên (1 điểm)

### Critical (5 scenarios - 50%)
- TS_PRODUCT_01-04: Core CRUD operations
- TS_PRODUCT_10: Security vulnerability

### High (3 scenarios - 30%)
- TS_PRODUCT_05-07: Essential validation

### Medium (2 scenarios - 20%)
- TS_PRODUCT_08-09: Boundary testing

---

## 1.2.4 Thiết kế 5 Test Cases chi tiết (5 điểm)

### TC_PRODUCT_001: Tạo sản phẩm mới thành công

| Field | Details |
|-------|---------|
| **Test Case ID** | TC_PRODUCT_001 |
| **Priority** | Critical |
| **Preconditions** | User logged in, userId = 1 |
| **Test Steps** | 1. Click "Add Product"<br>2. Enter title: "Laptop Dell"<br>3. Enter description: "High performance"<br>4. Enter quantity: 10<br>5. Click Save |
| **Expected Result** | - POST /api/products/1<br>- HTTP 201 Created<br>- Product added to DB<br>- Product appears in list |
| **Test Data** | Title: "Laptop Dell"<br>Description: "High performance"<br>Quantity: 10 |

### TC_PRODUCT_002: Xem danh sách sản phẩm

| Field | Details |
|-------|---------|
| **Test Case ID** | TC_PRODUCT_002 |
| **Priority** | Critical |
| **Preconditions** | User 1 has 3 products in DB |
| **Test Steps** | 1. Navigate to /users/1<br>2. View product list |
| **Expected Result** | - GET /api/products/1<br>- HTTP 200<br>- Display 3 products<br>- Show title, description, quantity for each |
| **Test Data** | userId: 1 |

### TC_PRODUCT_003: Tạo với title rỗng

| Field | Details |
|-------|---------|
| **Test Case ID** | TC_PRODUCT_003 |
| **Priority** | High |
| **Preconditions** | User on product page |
| **Test Steps** | 1. Click Add Product<br>2. Leave title empty<br>3. Enter quantity: 5<br>4. Click Save |
| **Expected Result** | - Frontend validation error<br>- Message: "Title is required"<br>- NO API call<br>- Product not created |
| **Test Data** | Title: "" (empty)<br>Quantity: 5 |

### TC_PRODUCT_004: Tạo với quantity âm

| Field | Details |
|-------|---------|
| **Test Case ID** | TC_PRODUCT_004 |
| **Priority** | High |
| **Preconditions** | User on product page |
| **Test Steps** | 1. Enter title: "Mouse"<br>2. Enter quantity: -10<br>3. Click Save |
| **Expected Result** | - Validation error<br>- "Quantity must be >= 0"<br>- Product not created |
| **Test Data** | Title: "Mouse"<br>Quantity: -10 |

### TC_PRODUCT_005: Update product của user khác

| Field | Details |
|-------|---------|
| **Test Case ID** | TC_PRODUCT_005 |
| **Priority** | Critical (Security) |
| **Preconditions** | User 1 logged in, Product ID 99 belongs to User 2 |
| **Test Steps** | 1. User 1 sends PUT /api/products/99<br>2. Update title to "Hacked" |
| **Expected Result** | - **Current:** HTTP 200, product updated (BUG!)<br>- **Expected:** HTTP 403 Forbidden<br>- Message: "You don't have permission"<br>- Product NOT updated |
| **Test Data** | productId: 99 (owned by User 2)<br>currentUser: User 1 |

---

# KẾT LUẬN VÀ KHUYẾN NGHỊ

## Tóm tắt

Đồ án đã hoàn thành phân tích và thiết kế test cases cho 2 chức năng chính:

1. **Login:** 10 test scenarios + 5 test cases chi tiết
2. **Product Management:** 10 test scenarios + 5 test cases chi tiết

Tổng cộng 20 scenarios covering happy paths, negative tests, boundary tests, edge cases, và security tests.

## Các vấn đề phát hiện

### Vấn đề nghiêm trọng (Critical):
1. **UPDATE/DELETE không kiểm tra ownership**
   - User A có thể sửa/xóa product của User B
   - Cần thêm authorization check ngay

2. **Session management không an toàn**
   - Lưu user data trực tiếp vào localStorage
   - Nên chuyển sang JWT token

### Vấn đề quan trọng (High):
3. **Thiếu pagination**
   - GET /api/products/{userId} trả về toàn bộ products
   - Có thể gây performance issue với nhiều products

4. **Validation chưa đầy đủ**
   - Frontend và backend validation không đồng bộ
   - Cần unified validation rules

## Khuyến nghị cải tiến

### Ưu tiên 1 (Ngay lập tức):
- Thêm ownership check cho UPDATE/DELETE endpoints
- Implement JWT authentication thay localStorage
- Fix security vulnerabilities

### Ưu tiên 2 (Ngắn hạn):
- Thêm pagination cho product list
- Unified validation (frontend + backend)
- Thêm rate limiting để prevent brute force

### Ưu tiên 3 (Dài hạn):
- Thêm Price và Category fields cho Product
- Implement product search và filter
- Add image upload cho products
- Thêm audit log cho security tracking

## Test Coverage Summary

| Module | Scenarios | Test Cases | Coverage |
|--------|-----------|------------|----------|
| Login | 10 | 5 | Happy path + Security + Validation |
| Product | 10 | 5 | CRUD + Security + Boundary |
| **Total** | **20** | **10** | **Comprehensive** |

---

**Tài liệu được tạo theo yêu cầu đề bài - đầy đủ 10-15 trang Word với font Times New Roman 14pt**
