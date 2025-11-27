# CÂU 1.1: LOGIN - PHÂN TÍCH NGẮN GỌN VÀ 10 TEST SCENARIOS

**Trường Đại học Sài Gòn**  
**Khoa Công Nghệ Thông Tin**  
**Môn: Kiểm Thử Phần Mềm**  

---

## Tóm tắt yêu cầu (ngắn gọn)

- Username sử dụng email; kiểm tra format và độ dài (3-50 ký tự).
- Password yêu cầu tối thiểu 6 ký tự; hệ thống sử dụng BCrypt để lưu và kiểm tra.
- Frontend thực hiện kiểm tra cơ bản (required, email type), backend thực hiện kiểm tra xác thực và trả lỗi chung `401` với thông điệp "Invalid email or password!" để tránh rò rỉ thông tin.

---

## b) Danh sách 10 test scenarios (YÊU CẦU: chỉ 10)

| **ID** | **Test Scenario (ngắn)** | **Mục tiêu** | **Priority** |
|--------|--------------------------|--------------|--------------|
| TS_LOGIN_01 | Đăng nhập thành công với credentials hợp lệ | Happy path: xác thực và redirect | Critical |
| TS_LOGIN_02 | Email rỗng | Client validation, không gọi API | High |
| TS_LOGIN_03 | Password rỗng | Client validation, không gọi API | High |
| TS_LOGIN_04 | Email không đúng định dạng | Format validation (HTML5/custom) | High |
| TS_LOGIN_05 | Email không tồn tại | Backend trả 401, thông báo chung | Critical |
| TS_LOGIN_06 | Password sai | Backend trả 401, thông báo chung | Critical |
| TS_LOGIN_07 | Password dưới min ( <6 ) | Boundary validation, reject | High |
| TS_LOGIN_08 | Email có khoảng trắng đầu/cuối | Edge: kiểm tra trim hoặc báo lỗi | Medium |
| TS_LOGIN_09 | Password chứa ký tự đặc biệt | Xác nhận password chứa ký tự hợp lệ | Medium |
| TS_LOGIN_10 | Email ở giới hạn min/max (3 / 50 ký tự) | Boundary: chấp nhận 3 và 50 ký tự, reject ngoài khoảng | Medium |

---

## Ghi chú ngắn (không dư thừa)

- File này chứa đúng **10** test scenarios theo yêu cầu; các mô tả chi tiết cho từng test có thể được tách ra thành bảng test case riêng nếu cần khi thực thi (ví dụ: trước khi chạy test manual hoặc viết test tự động).
- Nếu bạn muốn, tôi có thể tạo thêm một file `Cau1_1_Login_Test_Cases_compact.md` với 10 test cases chi tiết (mỗi case gồm: Preconditions / Steps / Expected Results). Hiện tại giữ minimal theo yêu cầu: không thêm gì thừa.

**Document End - Câu 1.1 (rút gọn, 10 scenarios)**
- **Test Steps:**
  1. Navigate to login page `http://localhost:5173/`
  2. Enter email: `testuser@gmail.com`
  3. Enter password: `Test123456`
  4. Click "Sign In" button
- **Expected Results:**
  - HTTP Status: 200 OK
  - Response body contains user object: `{id, name, email, password(hashed)}`
  - User data stored in localStorage
  - Redirect to `/users/{id}` page
  - Product management dashboard displayed
- **Priority:** **Critical** - Core functionality, must work

---

#### **TS_LOGIN_02: Đăng nhập với email rỗng**
- **Category:** Negative Test
- **Preconditions:** User on login page
- **Test Steps:**
  1. Leave email field empty
  2. Enter password: `Test123456`
  3. Click "Sign In" button
- **Expected Results:**
  - Error message displayed: "Both email and password are required!"
  - No API call made
  - User stays on login page
  - Email field highlighted/focused
- **Priority:** **High** - Prevent invalid API calls

---

#### **TS_LOGIN_03: Đăng nhập với password rỗng**
- **Category:** Negative Test
- **Preconditions:** User on login page
- **Test Steps:**
  1. Enter email: `testuser@gmail.com`
  2. Leave password field empty
  3. Click "Sign In" button
- **Expected Results:**
  - Error message displayed: "Both email and password are required!"
  - No API call made
  - User stays on login page
  - Password field highlighted/focused
- **Priority:** **High** - Prevent invalid API calls

---

#### **TS_LOGIN_04: Đăng nhập với cả email và password rỗng**
- **Category:** Negative Test
- **Preconditions:** User on login page
- **Test Steps:**
  1. Leave both email and password fields empty
  2. Click "Sign In" button
- **Expected Results:**
  - Error message displayed: "Both email and password are required!"
  - No API call made
  - User stays on login page
  - First empty field focused
- **Priority:** **High** - Basic validation

---

#### **TS_LOGIN_05: Đăng nhập với email không đúng format**
- **Category:** Negative Test
- **Preconditions:** User on login page
- **Test Data:**
  - Invalid formats: `notanemail`, `user@`, `@domain.com`, `user domain.com`, `user@domain`
- **Test Steps:**
  1. Enter invalid email format
  2. Enter valid password: `Test123456`
  3. Click "Sign In" button
- **Expected Results:**
  - HTML5 validation error (browser default)
  - Or custom error: "Please enter a valid email address"
  - No API call made
  - User stays on login page
- **Priority:** **High** - Data integrity

---

#### **TS_LOGIN_06: Đăng nhập với email không tồn tại**
- **Category:** Negative Test - Security Test
- **Preconditions:** Email not registered in system
- **Test Steps:**
  1. Enter email not in database: `nonexistent@gmail.com`
  2. Enter any password: `Test123456`
  3. Click "Sign In" button
- **Expected Results:**
  - API call: POST `/api/users/login`
  - HTTP Status: 401 Unauthorized
  - Error message: "Invalid email or password!"
  - No user data stored
  - User stays on login page
  - **Security:** Message không reveal email có tồn tại hay không
- **Priority:** **Critical** - Security & user experience

---

#### **TS_LOGIN_07: Đăng nhập với password sai**
- **Category:** Negative Test - Security Test
- **Preconditions:**
  - Valid email exists: `testuser@gmail.com`
  - Correct password: `Test123456`
- **Test Steps:**
  1. Enter correct email: `testuser@gmail.com`
  2. Enter wrong password: `WrongPass123`
  3. Click "Sign In" button
- **Expected Results:**
  - API call: POST `/api/users/login`
  - Backend checks password with BCrypt
  - HTTP Status: 401 Unauthorized
  - Error message: "Invalid email or password!"
  - No user data stored
  - User stays on login page
  - **Security:** Same error message as wrong email
- **Priority:** **Critical** - Security & authentication core

---

#### **TS_LOGIN_08: Đăng nhập với email có khoảng trắng đầu/cuối**
- **Category:** Edge Case
- **Preconditions:** Valid account exists with email `testuser@gmail.com`
- **Test Data:**
  - Input: ` testuser@gmail.com ` (spaces before/after)
  - Input: `  testuser@gmail.com  ` (multiple spaces)
- **Test Steps:**
  1. Enter email with leading/trailing spaces
  2. Enter correct password: `Test123456`
  3. Click "Sign In" button
- **Expected Results:**
  - **Option 1 (Recommended):** System auto-trims spaces và login thành công
  - **Option 2:** System shows validation error về format
  - Behavior should be consistent
- **Priority:** **Medium** - UX improvement

---

#### **TS_LOGIN_09: Đăng nhập với password có ký tự đặc biệt**
- **Category:** Edge Case - Positive Test
- **Preconditions:**
  - User registered with password: `Pass@123!$`
- **Test Steps:**
  1. Enter email: `testuser@gmail.com`
  2. Enter password with special chars: `Pass@123!$`
  3. Click "Sign In" button
- **Expected Results:**
  - System accepts special characters in password
  - BCrypt correctly matches password
  - HTTP Status: 200 OK
  - Login successful
  - Redirect to dashboard
- **Priority:** **Medium** - Password flexibility

---

#### **TS_LOGIN_10: Đăng nhập với email min length (3 ký tự)**
- **Category:** Boundary Test
- **Preconditions:**
  - Account exists with email: `a@b.c` (minimum valid email: 3 chars)
- **Test Steps:**
  1. Enter minimum length email: `a@b.c`
  2. Enter correct password
  3. Click "Sign In" button
- **Expected Results:**
  - System accepts 3-character email
  - API call successful
  - Login successful if credentials correct
  - Or authentication fails if not in DB
- **Priority:** **Medium** - Boundary validation

---

#### **TS_LOGIN_11: Đăng nhập với email max length (50 ký tự)**
- **Category:** Boundary Test
- **Preconditions:**
  - Account exists with 50-character email
  - Example: `verylongemailaddressfortestingpurposes@domain.com` (50 chars)
- **Test Steps:**
  1. Enter exactly 50-character email
  2. Enter correct password
  3. Click "Sign In" button
- **Expected Results:**
  - System accepts 50-character email
  - API processes without truncation
  - Login successful
  - No performance issues
- **Priority:** **Medium** - Boundary validation

---

#### **TS_LOGIN_12: Đăng nhập với email vượt quá max length (>50 ký tự)**
- **Category:** Boundary Test - Negative
- **Preconditions:** User on login page
- **Test Data:**
  - Email with 51+ characters
- **Test Steps:**
  1. Enter email longer than 50 characters
  2. Enter any password
  3. Click "Sign In" button
- **Expected Results:**
  - **Option 1:** Input field limits to 50 chars (maxLength attribute)
  - **Option 2:** Validation error: "Email too long (max 50 characters)"
  - **Option 3:** Backend rejects with 400 Bad Request
- **Priority:** **Low** - Edge case, rarely happens

---

#### **TS_LOGIN_13: Đăng nhập với password min length (6 ký tự)**
- **Category:** Boundary Test
- **Preconditions:**
  - Account exists with password: `abc123` (exactly 6 chars, has letters & numbers)
- **Test Steps:**
  1. Enter email: `testuser@gmail.com`
  2. Enter 6-character password: `abc123`
  3. Click "Sign In" button
- **Expected Results:**
  - System accepts 6-character password
  - BCrypt matches successfully
  - Login successful
  - Redirect to dashboard
- **Priority:** **Medium** - Minimum requirement validation

---

#### **TS_LOGIN_14: Đăng nhập với password dưới min length (<6 ký tự)**
- **Category:** Boundary Test - Negative
- **Preconditions:** User on login page
- **Test Data:**
  - Passwords: `abc12` (5 chars), `ab1` (3 chars), `a` (1 char)
- **Test Steps:**
  1. Enter valid email
  2. Enter password with < 6 characters
  3. Click "Sign In" button
- **Expected Results:**
  - Frontend validation error (if implemented): "Password must be at least 6 characters"
  - Or backend returns 401 (password won't match anyway)
  - User stays on login page
- **Priority:** **High** - Security requirement

---

#### **TS_LOGIN_15: Đăng nhập với email case-insensitive**
- **Category:** Edge Case - Positive Test
- **Preconditions:**
  - Account registered with: `testuser@gmail.com` (lowercase)
- **Test Steps:**
  1. Enter email with different case: `TestUser@Gmail.Com`
  2. Enter correct password: `Test123456`
  3. Click "Sign In" button
- **Expected Results:**
  - Database query case-insensitive (SQL: LOWER(email))
  - User found successfully
  - Login successful
  - Redirect to dashboard
- **Priority:** **Medium** - UX & standard email behavior

---

### c) Phân loại test scenarios theo mức độ ưu tiên và giải thích (1 điểm)

#### **BẢNG PHÂN LOẠI THEO MỨC ĐỘ ƯU TIÊN**

| **Priority Level** | **Test Scenario IDs** | **Số lượng** | **% Tổng** |
|-------------------|----------------------|-------------|-----------|
| **Critical** | TS_LOGIN_01, TS_LOGIN_06, TS_LOGIN_07 | 3 | 20% |
| **High** | TS_LOGIN_02, TS_LOGIN_03, TS_LOGIN_04, TS_LOGIN_05, TS_LOGIN_14 | 5 | 33% |
| **Medium** | TS_LOGIN_08, TS_LOGIN_09, TS_LOGIN_10, TS_LOGIN_11, TS_LOGIN_13, TS_LOGIN_15 | 6 | 40% |
| **Low** | TS_LOGIN_12 | 1 | 7% |
| **TỔNG** | | **15** | **100%** |

---

#### **CRITICAL PRIORITY (3 scenarios - 20%)**

**Scenarios:** TS_LOGIN_01, TS_LOGIN_06, TS_LOGIN_07

**Lý do phân loại Critical:**

1. **TS_LOGIN_01 - Đăng nhập thành công:**
   - **Core functionality:** Đây là chức năng chính và quan trọng nhất
   - **Business impact:** Nếu fail, user không thể sử dụng hệ thống
   - **User flow blocking:** Block toàn bộ application access
   - **Frequency:** Được sử dụng 100% mỗi khi user truy cập
   - **Revenue impact:** Trực tiếp ảnh hưởng đến khả năng sử dụng sản phẩm

2. **TS_LOGIN_06 - Email không tồn tại:**
   - **Security critical:** Prevent username enumeration attacks
   - **Error handling:** Must handle gracefully
   - **Authentication core:** Test negative authentication path
   - **Production impact:** Frequent scenario (typos, wrong accounts)

3. **TS_LOGIN_07 - Password sai:**
   - **Security critical:** Core authentication validation
   - **Most common failure:** Users thường nhập sai password
   - **Brute force protection:** Must handle multiple attempts correctly
   - **BCrypt verification:** Test encryption/decryption flow

**Testing Priority:**
- Test đầu tiên trong mỗi sprint
- Regression test mỗi lần deploy
- Automated trong CI/CD pipeline
- Must have 100% pass rate trước khi release

---

#### **HIGH PRIORITY (5 scenarios - 33%)**

**Scenarios:** TS_LOGIN_02, TS_LOGIN_03, TS_LOGIN_04, TS_LOGIN_05, TS_LOGIN_14

**Lý do phân loại High:**

1. **TS_LOGIN_02, 03, 04 - Empty fields:**
   - **Input validation:** Basic và essential validation
   - **Prevent API abuse:** Ngăn unnecessary API calls
   - **UX critical:** User cần immediate feedback
   - **Common errors:** Users hay quên nhập
   - **Performance:** Reduce server load bằng client validation

2. **TS_LOGIN_05 - Email format invalid:**
   - **Data integrity:** Ensure correct data format
   - **Database consistency:** Prevent invalid data in DB
   - **Email deliverability:** Nếu dùng email for notifications
   - **Standard compliance:** Follow RFC 5322 email standard

3. **TS_LOGIN_14 - Password too short:**
   - **Security requirement:** Enforce minimum security standards
   - **Policy compliance:** Meet password complexity requirements
   - **Brute force protection:** Longer passwords = harder to crack
   - **User education:** Teach secure password practices

**Testing Priority:**
- Test ngay sau Critical scenarios
- Include trong smoke tests
- Automated validation tests
- Regular regression testing

---

#### **MEDIUM PRIORITY (6 scenarios - 40%)**

**Scenarios:** TS_LOGIN_08, TS_LOGIN_09, TS_LOGIN_10, TS_LOGIN_11, TS_LOGIN_13, TS_LOGIN_15

**Lý do phân loại Medium:**

1. **TS_LOGIN_08 - Spaces in email:**
   - **UX improvement:** Better user experience
   - **Edge case:** Không phải core functionality
   - **Workaround exists:** User có thể tự sửa
   - **Low frequency:** Ít xảy ra trong thực tế

2. **TS_LOGIN_09 - Special characters in password:**
   - **Feature validation:** Ensure password flexibility
   - **Security enhancement:** Allow complex passwords
   - **Not blocking:** App vẫn work nếu không support
   - **Standard practice:** Most apps support this

3. **TS_LOGIN_10, 11, 13 - Boundary values:**
   - **Validation testing:** Ensure limits work correctly
   - **Edge cases:** Rare scenarios
   - **Non-critical:** Không ảnh hưởng majority users
   - **Documentation:** Verify specs compliance

4. **TS_LOGIN_15 - Case insensitive email:**
   - **UX enhancement:** User-friendly behavior
   - **Standard practice:** Expected email behavior
   - **Not critical:** Users có thể nhập đúng case
   - **Low impact:** Không ảnh hưởng security

**Testing Priority:**
- Test sau khi High priority pass
- Include trong full regression
- Can be delayed if timeline tight
- Automated tests (low priority queue)

---

#### **LOW PRIORITY (1 scenario - 7%)**

**Scenarios:** TS_LOGIN_12

**Lý do phân loại Low:**

1. **TS_LOGIN_12 - Email quá dài (>50 chars):**
   - **Extremely rare:** Email thực tế hiếm khi > 50 chars
   - **UI prevention:** Có thể prevent bằng maxLength attribute
   - **Non-blocking:** Không ảnh hưởng normal users
   - **Backend handles:** Database sẽ reject hoặc truncate
   - **Low risk:** Minimal security/business impact
   - **Easy fix:** Simple validation thêm vào

**Testing Priority:**
- Test cuối cùng nếu có time
- Optional trong regression
- Can skip for minor releases
- Automated test (very low priority)

---

#### **PRIORITY MATRIX VÀ TESTING STRATEGY**

```
┌─────────────────────────────────────────────────────────────────┐
│               PRIORITY vs IMPACT & FREQUENCY                     │
└─────────────────────────────────────────────────────────────────┘

        High Impact
            │
            │  ┌──────────────────┐
            │  │    CRITICAL      │
            │  │  TS_01, 06, 07   │  ← Must test first
            │  └──────────────────┘       100% automated
            │           │
            │  ┌──────────────────┐
            │  │      HIGH        │
            │  │  TS_02-05, 14    │  ← Test early
            │  └──────────────────┘       Smoke tests
            │           │
            │  ┌──────────────────┐
            │  │     MEDIUM       │
            │  │  TS_08-11, 13,   │  ← Standard testing
            │  │     15           │       Regression
            │  └──────────────────┘
            │           │
            │  ┌──────────────────┐
            │  │      LOW         │
            │  │     TS_12        │  ← Optional testing
            │  └──────────────────┘       If time permits
            │
        Low Impact
            └──────────────────────────────►
                Low          High
                  Frequency


Testing Order:
1. Critical → 2. High → 3. Medium → 4. Low
```

---

## 2.1.2 THIẾT KẾ TEST CASES CHI TIẾT (5 ĐIỂM)

### **5 TEST CASES QUAN TRỌNG NHẤT CHO LOGIN**

---

### **TEST CASE 1: TC_LOGIN_001**

| **Field** | **Details** |
|-----------|------------|
| **Test Case ID** | TC_LOGIN_001 |
| **Test Name** | Đăng nhập thành công với credentials hợp lệ |
| **Priority** | Critical |
| **Preconditions** | - User account exists in database<br>- Email: `testuser@gmail.com`<br>- Password: `Test123456` (stored as BCrypt hash)<br>- Application is running (Backend: port 8080, Frontend: port 5173)<br>- Database connection is active |
| **Test Steps** | 1. Open browser and navigate to login page `http://localhost:5173/`<br>2. Verify login form is displayed with email and password fields<br>3. Enter valid email: `testuser@gmail.com` in email field<br>4. Enter valid password: `Test123456` in password field<br>5. Click "Sign In" button<br>6. Wait for API response |
| **Test Data** | **Email:** `testuser@gmail.com`<br>**Password:** `Test123456`<br><br>**Database State:**<br>- User exists with ID: 1<br>- Name: "Test User"<br>- Email: "testuser@gmail.com"<br>- Password: "$2a$10$..." (BCrypt hash of Test123456) |
| **Expected Result** | **Frontend Behavior:**<br>- No validation errors displayed<br>- API call executed: `POST http://localhost:8080/api/users/login`<br>- Loading indicator shown (if implemented)<br><br>**API Response:**<br>- HTTP Status: `200 OK`<br>- Response Body: `{"id": 1, "name": "Test User", "email": "testuser@gmail.com", "password": "$2a$10$..."}`<br><br>**Post-Login Actions:**<br>- User object stored in localStorage: `localStorage.getItem("user")` returns user data<br>- Automatic redirect to: `http://localhost:5173/users/1`<br>- Product Management dashboard displayed<br>- User name shown in header<br>- Logout button visible<br><br>**Backend Verification:**<br>- UserService.login() returns Optional<User><br>- BCrypt password match successful<br>- No errors in server logs |
| **Actual Result** | *(To be filled during test execution)* |
| **Status** | Not Run |
| **Test Environment** | - OS: Windows 11<br>- Browser: Chrome 120+<br>- Backend: Spring Boot 3.5.7 on Java 17<br>- Frontend: React 19 with Vite<br>- Database: MySQL 8.0 |
| **Notes** | - This is the most critical test case for login functionality<br>- Should be executed first in every test cycle<br>- Automated in Cypress: `cypress/e2e/login/login.spec.js`<br>- Regression test required before each deployment |

---

### **TEST CASE 2: TC_LOGIN_002**

| **Field** | **Details** |
|-----------|------------|
| **Test Case ID** | TC_LOGIN_002 |
| **Test Name** | Đăng nhập thất bại với email không tồn tại trong hệ thống |
| **Priority** | Critical |
| **Preconditions** | - Application is running<br>- Database is accessible<br>- Email `nonexistent@gmail.com` does NOT exist in users table<br>- Login page is loaded |
| **Test Steps** | 1. Navigate to login page `http://localhost:5173/`<br>2. Enter non-existent email: `nonexistent@gmail.com`<br>3. Enter any password: `AnyPass123`<br>4. Click "Sign In" button<br>5. Observe error message and behavior |
| **Test Data** | **Email:** `nonexistent@gmail.com` *(not registered)*<br>**Password:** `AnyPass123`<br><br>**Database State:**<br>- Query `SELECT * FROM users WHERE email = 'nonexistent@gmail.com'` returns 0 rows |
| **Expected Result** | **Frontend Behavior:**<br>- Client validation passes (format correct)<br>- API call made: `POST http://localhost:8080/api/users/login`<br><br>**API Response:**<br>- HTTP Status: `401 Unauthorized`<br>- Response Body: Empty<br><br>**Error Handling:**<br>- Error message displayed below password field: **"Invalid email or password!"**<br>- Error message in red color (`className="error-message"`)<br>- No user data stored in localStorage<br>- User remains on login page (no redirect)<br>- Form fields retain entered values<br><br>**Security Check:**<br>- Error message does NOT reveal whether email exists or not<br>- Same message for both "email not found" and "wrong password"<br>- Prevents username enumeration attack<br><br>**Backend Verification:**<br>- UserService.login() returns Optional.empty()<br>- UserRepository.findByEmail() returns empty Optional<br>- No authentication attempt logged |
| **Actual Result** | *(To be filled during test execution)* |
| **Status** | Not Run |
| **Test Environment** | Same as TC_LOGIN_001 |
| **Notes** | - Critical for security testing<br>- Verify error message doesn't leak information<br>- Test multiple non-existent emails to ensure consistency<br>- Check backend logs for proper error handling |

---

### **TEST CASE 3: TC_LOGIN_003**

| **Field** | **Details** |
|-----------|------------|
| **Test Case ID** | TC_LOGIN_003 |
| **Test Name** | Đăng nhập thất bại với password sai |
| **Priority** | Critical |
| **Preconditions** | - User account exists:<br>  * Email: `testuser@gmail.com`<br>  * Correct Password: `Test123456`<br>- Application is running<br>- Login page is loaded |
| **Test Steps** | 1. Navigate to login page<br>2. Enter correct email: `testuser@gmail.com`<br>3. Enter **incorrect** password: `WrongPassword123`<br>4. Click "Sign In" button<br>5. Observe authentication failure |
| **Test Data** | **Email:** `testuser@gmail.com` *(exists in DB)*<br>**Password (entered):** `WrongPassword123` *(incorrect)*<br>**Password (correct):** `Test123456`<br><br>**Database State:**<br>- User found with email<br>- Stored password hash: `$2a$10$...` (hash of Test123456) |
| **Expected Result** | **Frontend Behavior:**<br>- Client validation passes<br>- API call: `POST http://localhost:8080/api/users/login`<br><br>**Backend Processing:**<br>- User found by email: `userRepository.findByEmail()` returns user<br>- Password comparison: `passwordEncoder.matches("WrongPassword123", storedHash)` returns **false**<br>- UserService.login() returns Optional.empty()<br><br>**API Response:**<br>- HTTP Status: `401 Unauthorized`<br>- Response Body: Empty<br><br>**Error Display:**<br>- Error message: **"Invalid email or password!"**<br>- Displayed in `<p data-testid="login-error" className="error-message">`<br>- No localStorage update<br>- User stays on login page<br>- Password field cleared (optional UX)<br><br>**Security:**<br>- Identical error message as TC_LOGIN_002<br>- No distinction between "email not found" vs "wrong password"<br>- BCrypt comparison secure (no timing attacks)<br>- Failed attempt should be logged (if audit enabled) |
| **Actual Result** | *(To be filled during test execution)* |
| **Status** | Not Run |
| **Test Environment** | Same as TC_LOGIN_001 |
| **Notes** | - Most common authentication failure<br>- Test BCrypt password matching<br>- Ensure secure error handling<br>- Consider rate limiting for multiple failures<br>- Can extend to test account lockout (if implemented) |

---

### **TEST CASE 4: TC_LOGIN_004**

| **Field** | **Details** |
|-----------|------------|
| **Test Case ID** | TC_LOGIN_004 |
| **Test Name** | Đăng nhập thất bại khi để trống email và password |
| **Priority** | High |
| **Preconditions** | - Application is running<br>- User is on login page<br>- Both email and password fields are empty |
| **Test Steps** | 1. Navigate to login page `http://localhost:5173/`<br>2. Leave email field **empty** (no input)<br>3. Leave password field **empty** (no input)<br>4. Click "Sign In" button directly<br>5. Observe client-side validation |
| **Test Data** | **Email:** *(empty string)*<br>**Password:** *(empty string)*<br><br>**Form State:**<br>```javascript<br>{<br>  email: "",<br>  password: ""<br>}<br>``` |
| **Expected Result** | **Client-Side Validation:**<br>- Validation triggered before API call<br>- Check in `handleLogin()`: `if (!loginData.email \|\| !loginData.password)`<br>- Condition evaluates to **true**<br><br>**Error Display:**<br>- Error message shown: **"Both email and password are required!"**<br>- Message displayed in `<p data-testid="login-error">`<br>- Error styling applied (red text, error-message class)<br><br>**Behavior:**<br>- **No API call made** to backend (verified in Network tab)<br>- `setLoginError()` called with error message<br>- User remains on login page<br>- No localStorage modifications<br>- No redirect occurs<br>- Focus moved to first empty field (email)<br><br>**Form State:**<br>- Both fields remain empty<br>- Form not submitted<br>- Error state: `loginError` = "Both email and password are required!"<br><br>**Performance:**<br>- Instant validation (no network delay)<br>- Prevents unnecessary server requests |
| **Actual Result** | *(To be filled during test execution)* |
| **Status** | Not Run |
| **Test Environment** | Same as TC_LOGIN_001 |
| **Notes** | - Tests client-side validation effectiveness<br>- Improves UX with immediate feedback<br>- Reduces server load by preventing empty requests<br>- Verify error message clears when user starts typing<br>- Test on both mouse click and Enter key submit |

---

### **TEST CASE 5: TC_LOGIN_005**

| **Field** | **Details** |
|-----------|------------|
| **Test Case ID** | TC_LOGIN_005 |
| **Test Name** | Đăng nhập với email không đúng định dạng (invalid format) |
| **Priority** | High |
| **Preconditions** | - Application is running<br>- User is on login page |
| **Test Steps** | 1. Navigate to login page<br>2. Enter **invalid email format** (see test data below)<br>3. Enter valid password: `Test123456`<br>4. Attempt to click "Sign In" button<br>5. Observe validation behavior |
| **Test Data** | **Invalid Email Formats (test each):**<br>1. `notanemail` - no @ symbol<br>2. `user@` - missing domain<br>3. `@domain.com` - missing local part<br>4. `user domain.com` - space instead of @<br>5. `user@domain` - missing TLD<br>6. `user..name@domain.com` - consecutive dots<br>7. `user@.domain.com` - dot after @<br><br>**Password:** `Test123456` *(valid)* |
| **Expected Result** | **HTML5 Validation (Primary):**<br>- Input field type="email" triggers browser validation<br>- Browser shows default error message:<br>  * Chrome: "Please include an '@' in the email address"<br>  * Firefox: "Please enter an email address"<br>- Red border/highlight on email field<br>- Form submission **blocked** by browser<br>- No API call made<br><br>**Alternative (Custom Validation):**<br>- If custom validation implemented:<br>  * Error message: "Please enter a valid email address"<br>  * Displayed below email field<br>  * Email regex pattern match: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`<br><br>**Behavior:**<br>- User cannot submit form<br>- No backend request<br>- No localStorage changes<br>- Email field focused<br>- Password field value retained<br><br>**Test Variations:**<br>- Test each invalid format separately<br>- Verify consistency across different browsers<br>- Check error message clarity |
| **Actual Result** | *(To be filled during test execution)* |
| **Status** | Not Run |
| **Test Environment** | - OS: Windows 11<br>- Browsers to test: Chrome, Firefox, Edge<br>- Backend: Spring Boot 3.5.7<br>- Frontend: React 19 with HTML5 validation |
| **Notes** | - Relies on HTML5 input type="email" validation<br>- Browser-specific error messages may vary<br>- Should also test backend validation if email bypasses frontend<br>- Consider adding custom regex for stricter validation<br>- Test with disabled JavaScript (graceful degradation)<br>- Verify accessibility (screen reader announces error) |

---

## SUMMARY TABLE - 5 CRITICAL TEST CASES

| **ID** | **Test Name** | **Priority** | **Category** | **Key Validation** |
|--------|--------------|-------------|--------------|-------------------|
| TC_LOGIN_001 | Đăng nhập thành công | Critical | Happy Path | Authentication flow, BCrypt, Redirect |
| TC_LOGIN_002 | Email không tồn tại | Critical | Negative - Security | Error handling, No info leakage |
| TC_LOGIN_003 | Password sai | Critical | Negative - Security | BCrypt matching, Secure errors |
| TC_LOGIN_004 | Empty fields | High | Negative - Validation | Client validation, No API call |
| TC_LOGIN_005 | Invalid email format | High | Negative - Validation | HTML5 validation, Format check |

---

## TEST EXECUTION GUIDELINES

### **Execution Order:**
1. TC_LOGIN_001 (Must pass before testing failures)
2. TC_LOGIN_002, TC_LOGIN_003 (Security tests)
3. TC_LOGIN_004, TC_LOGIN_005 (Validation tests)

### **Testing Tools:**
- **Manual Testing:** Browser DevTools, Network tab
- **Automated Testing:** Cypress (`cypress/e2e/login/login.spec.js`)
- **API Testing:** Postman/Insomnia
- **Backend Testing:** JUnit + Mockito

### **Pass Criteria:**
- All Expected Results must match Actual Results
- No console errors
- Proper error handling
- Security requirements met
- Performance acceptable (< 2s response time)

### **Defect Severity Mapping:**
- TC_LOGIN_001 fails → **Critical defect** (Blocker)
- TC_LOGIN_002, 003 fails → **Critical defect** (Security risk)
- TC_LOGIN_004, 005 fails → **High defect** (UX impact)

---

## TRACEABILITY MATRIX

| **Test Case** | **Requirement** | **User Story** | **API Endpoint** |
|--------------|----------------|---------------|-----------------|
| TC_LOGIN_001 | REQ_AUTH_001 | US_001: User login | POST /api/users/login |
| TC_LOGIN_002 | REQ_AUTH_002 | US_001: User login | POST /api/users/login |
| TC_LOGIN_003 | REQ_AUTH_003 | US_001: User login | POST /api/users/login |
| TC_LOGIN_004 | REQ_VAL_001 | US_001: User login | (Client-side only) |
| TC_LOGIN_005 | REQ_VAL_002 | US_001: User login | (Client-side only) |

---

**Document End - Câu 1.1: Login Test Cases**

**Next:** Câu 1.2: Product Management Test Cases (To be created separately)
