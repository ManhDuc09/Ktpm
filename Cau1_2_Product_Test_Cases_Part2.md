# CÂU 1.2: PRODUCT - PHÂN TÍCH VÀ TEST SCENARIOS (10 ĐIỂM)
## PHẦN 2: TEST SCENARIOS VÀ PRIORITY CLASSIFICATION

**Trường Đại học Sài Gòn**  
**Khoa Công Nghệ Thông Tin**  
**Môn: Kiểm Thử Phần Mềm**  
**Niên khóa: 2024-2025**

---

### b) Liệt kê và mô tả ít nhất 10 test scenarios cho Product (2 điểm)

#### **DANH SÁCH 20 TEST SCENARIOS CHO PRODUCT MANAGEMENT**

| **ID** | **Test Scenario** | **Category** | **CRUD** | **Description** | **Priority** |
|--------|------------------|--------------|----------|-----------------|--------------|
| **TS_PRODUCT_01** | Tạo sản phẩm mới thành công với dữ liệu hợp lệ | Happy Path | CREATE | User tạo product với title, description, quantity hợp lệ, hệ thống lưu thành công và hiển thị trong list | **Critical** |
| **TS_PRODUCT_02** | Xem danh sách sản phẩm của user | Happy Path | READ | User truy cập trang quản lý, hệ thống load và hiển thị tất cả products của user đó | **Critical** |
| **TS_PRODUCT_03** | Cập nhật thông tin sản phẩm thành công | Happy Path | UPDATE | User chỉnh sửa title/quantity của product, hệ thống update và reflect changes ngay lập tức | **Critical** |
| **TS_PRODUCT_04** | Xóa sản phẩm thành công | Happy Path | DELETE | User click Delete và confirm, hệ thống xóa product khỏi DB và UI | **Critical** |
| **TS_PRODUCT_05** | Tạo sản phẩm với title rỗng | Negative Test | CREATE | User submit form với title empty, hệ thống reject và hiển thị error | **High** |
| **TS_PRODUCT_06** | Tạo sản phẩm với quantity âm | Negative Test | CREATE | User nhập quantity < 0, hệ thống reject với validation error | **High** |
| **TS_PRODUCT_07** | Tạo sản phẩm với title dưới min length (< 3 ký tự) | Boundary Test | CREATE | User nhập title có 1-2 ký tự, hệ thống báo lỗi về độ dài tối thiểu | **High** |
| **TS_PRODUCT_08** | Tạo sản phẩm với title đúng min length (3 ký tự) | Boundary Test | CREATE | User nhập title = 3 ký tự, hệ thống accept và tạo product thành công | **Medium** |
| **TS_PRODUCT_09** | Tạo sản phẩm với title đúng max length (100 ký tự) | Boundary Test | CREATE | User nhập title = 100 ký tự, hệ thống accept và lưu đầy đủ | **Medium** |
| **TS_PRODUCT_10** | Tạo sản phẩm với title vượt quá max length (> 100 ký tự) | Boundary Test | CREATE | User nhập title > 100 ký tự, hệ thống truncate hoặc reject | **Medium** |
| **TS_PRODUCT_11** | Tạo sản phẩm với quantity = 0 (out of stock) | Boundary Test | CREATE | User nhập quantity = 0, hệ thống accept (valid edge case) | **Medium** |
| **TS_PRODUCT_12** | Tạo sản phẩm với quantity max (99,999) | Boundary Test | CREATE | User nhập quantity = 99,999, hệ thống accept và lưu chính xác | **Medium** |
| **TS_PRODUCT_13** | Tạo sản phẩm với quantity > max (> 99,999) | Boundary Test | CREATE | User nhập quantity > 99,999, hệ thống reject hoặc cap tại max | **Low** |
| **TS_PRODUCT_14** | Tạo sản phẩm với description vượt quá 500 ký tự | Boundary Test | CREATE | User nhập description > 500 chars, hệ thống truncate hoặc reject | **Medium** |
| **TS_PRODUCT_15** | Cập nhật sản phẩm không tồn tại (invalid product ID) | Negative Test | UPDATE | User cố update product đã bị xóa hoặc ID không tồn tại, hệ thống trả về 404 | **High** |
| **TS_PRODUCT_16** | Xóa sản phẩm không tồn tại (invalid product ID) | Negative Test | DELETE | User cố xóa product không tồn tại, hệ thống trả về 404 Not Found | **High** |
| **TS_PRODUCT_17** | Xem danh sách rỗng (user chưa có product nào) | Edge Case | READ | User mới, chưa tạo product, hệ thống hiển thị "No items yet." | **Medium** |
| **TS_PRODUCT_18** | Tạo sản phẩm trùng tên (duplicate title) | Edge Case | CREATE | User tạo product với title đã tồn tại, hệ thống cho phép (no unique constraint) | **Low** |
| **TS_PRODUCT_19** | Hủy bỏ thao tác xóa sản phẩm | Edge Case | DELETE | User click Delete nhưng chọn Cancel trong confirm dialog, product không bị xóa | **Medium** |
| **TS_PRODUCT_20** | Cập nhật product với userId không hợp lệ | Security Test | UPDATE | User cố update product của user khác, hệ thống **nên** reject (hiện tại chưa có) | **Critical** |

---

### **MÔ TẢ CHI TIẾT TỪNG TEST SCENARIO:**

---

#### **TS_PRODUCT_01: Tạo sản phẩm mới thành công với dữ liệu hợp lệ**
- **Category:** Happy Path - CREATE
- **Preconditions:**
  - User đã đăng nhập với ID = 1
  - User đang ở trang Product Management
  - Backend và database đang chạy
- **Test Steps:**
  1. Click button "Add Product"
  2. Modal hiển thị với form rỗng
  3. Enter title: "Laptop Dell XPS 15"
  4. Enter description: "High-performance laptop with 16GB RAM"
  5. Enter quantity: 10
  6. Click "Save" button
  7. Wait for API response
- **Expected Results:**
  - API call: `POST /api/products/1`
  - HTTP Status: 200 OK
  - Response body chứa product với ID mới generated
  - Modal tự động đóng
  - Product xuất hiện ngay trong table
  - Database có record mới với user_id = 1
  - Toast/notification thành công (nếu có)
- **Priority:** **Critical** - Core CREATE functionality

---

#### **TS_PRODUCT_02: Xem danh sách sản phẩm của user**
- **Category:** Happy Path - READ
- **Preconditions:**
  - User ID = 1 đã đăng nhập
  - User có 3 products trong database:
    * ID 1: "Laptop Dell", quantity: 10
    * ID 2: "Mouse Logitech", quantity: 50
    * ID 3: "Keyboard Mechanical", quantity: 25
- **Test Steps:**
  1. Navigate to `/users/1` page
  2. Page loads và useEffect triggers
  3. API call được thực hiện
  4. Wait for data rendering
- **Expected Results:**
  - API call: `GET /api/products/1`
  - HTTP Status: 200 OK
  - Response: Array with 3 products
  - Table renders với 3 rows
  - Mỗi row hiển thị: title, description, quantity, actions (Edit/Delete)
  - Data hiển thị chính xác theo database
  - No loading errors
- **Priority:** **Critical** - Essential READ operation

---

#### **TS_PRODUCT_03: Cập nhật thông tin sản phẩm thành công**
- **Category:** Happy Path - UPDATE
- **Preconditions:**
  - Product exists: ID = 1, title = "Laptop Dell", quantity = 10
  - User đã đăng nhập và xem được product list
- **Test Steps:**
  1. Click "Edit" button trên product row ID = 1
  2. Modal mở với data pre-filled
  3. Change title to: "Laptop Dell XPS 17"
  4. Change quantity to: 15
  5. Keep description unchanged
  6. Click "Save" button
- **Expected Results:**
  - API call: `PUT /api/products/1`
  - Request body: updated title và quantity
  - HTTP Status: 200 OK
  - Response: Updated product object
  - Modal closes
  - Table row updates immediately với new values
  - Database reflects changes
  - No page refresh needed (optimistic UI update)
- **Priority:** **Critical** - Core UPDATE functionality

---

#### **TS_PRODUCT_04: Xóa sản phẩm thành công**
- **Category:** Happy Path - DELETE
- **Preconditions:**
  - Product exists: ID = 5, title = "Old Product"
  - User đang xem product list
- **Test Steps:**
  1. Click "Delete" button on product ID = 5
  2. Browser shows confirm dialog: "Are you sure?"
  3. Click "OK" to confirm
  4. Wait for API response
- **Expected Results:**
  - API call: `DELETE /api/products/5`
  - HTTP Status: 200 OK
  - Response: "Product deleted successfully"
  - Product row biến mất khỏi table ngay lập tức
  - Database không còn record với ID = 5
  - State updated: product removed from array
  - No errors in console
- **Priority:** **Critical** - Core DELETE functionality

---

#### **TS_PRODUCT_05: Tạo sản phẩm với title rỗng**
- **Category:** Negative Test - CREATE
- **Preconditions:** User on Add Product modal
- **Test Steps:**
  1. Click "Add Product"
  2. Leave title field **empty**
  3. Enter description: "Some description"
  4. Enter quantity: 10
  5. Click "Save"
- **Expected Results:**
  - **Client validation:**
    * Error message: "Title is required" hoặc "Title must be at least 3 characters"
    * Title field highlighted in red
    * No API call made
  - **OR Backend validation (if bypassed):**
    * API call: POST /api/products/1
    * HTTP Status: 400 Bad Request
    * Error response with validation details
  - Modal stays open
  - User can correct and retry
- **Priority:** **High** - Prevent invalid data

---

#### **TS_PRODUCT_06: Tạo sản phẩm với quantity âm**
- **Category:** Negative Test - CREATE
- **Preconditions:** User on Add Product modal
- **Test Steps:**
  1. Enter title: "Test Product"
  2. Enter description: "Test"
  3. Enter quantity: **-5** (negative number)
  4. Click "Save"
- **Expected Results:**
  - **HTML5 validation:**
    * Input type="number" prevents negative (depending on min attribute)
    * Browser may show validation message
  - **OR Backend validation:**
    * API call made but rejected
    * HTTP Status: 400 Bad Request
    * Error: "Quantity must be >= 0"
  - Product not created
  - Error displayed to user
- **Priority:** **High** - Data integrity

---

#### **TS_PRODUCT_07: Tạo sản phẩm với title dưới min length (< 3 ký tự)**
- **Category:** Boundary Test - CREATE
- **Preconditions:** User on Add Product modal
- **Test Data:**
  - Title với 1 char: "A"
  - Title với 2 chars: "AB"
- **Test Steps:**
  1. Enter title: "AB" (2 characters)
  2. Enter valid description và quantity
  3. Click "Save"
- **Expected Results:**
  - Validation error: "Title must be at least 3 characters"
  - No API call (if client validation)
  - OR 400 Bad Request (if backend validation)
  - Product not created
  - User prompted to enter longer title
- **Priority:** **High** - Validation requirement

---

#### **TS_PRODUCT_08: Tạo sản phẩm với title đúng min length (3 ký tự)**
- **Category:** Boundary Test - CREATE (Positive)
- **Preconditions:** User on Add Product modal
- **Test Steps:**
  1. Enter title: "ABC" (exactly 3 characters)
  2. Enter description: "Min length test"
  3. Enter quantity: 5
  4. Click "Save"
- **Expected Results:**
  - Validation passes
  - API call: POST /api/products/1
  - HTTP Status: 200 OK
  - Product created successfully
  - Title saved as "ABC" (no truncation)
  - Product appears in list
- **Priority:** **Medium** - Boundary validation

---

#### **TS_PRODUCT_09: Tạo sản phẩm với title đúng max length (100 ký tự)**
- **Category:** Boundary Test - CREATE (Positive)
- **Preconditions:** User on Add Product modal
- **Test Data:**
  - Title with exactly 100 characters: "A" repeated 100 times
- **Test Steps:**
  1. Enter title with 100 characters
  2. Enter valid description and quantity
  3. Click "Save"
- **Expected Results:**
  - Validation passes
  - API call successful
  - Product created with full 100-char title
  - Database stores complete title without truncation
  - Display correctly in UI (may need ellipsis for UX)
- **Priority:** **Medium** - Boundary validation

---

#### **TS_PRODUCT_10: Tạo sản phẩm với title vượt quá max length (> 100 ký tự)**
- **Category:** Boundary Test - CREATE (Negative)
- **Preconditions:** User on Add Product modal
- **Test Data:**
  - Title with 101+ characters
- **Test Steps:**
  1. Enter title with 150 characters
  2. Enter valid other fields
  3. Click "Save"
- **Expected Results:**
  - **Option 1:** Input field maxLength attribute prevents typing beyond 100
  - **Option 2:** Client validation shows error
  - **Option 3:** Backend truncates to 100 chars
  - **Option 4:** Backend rejects with 400 Bad Request
  - Behavior should be documented và consistent
- **Priority:** **Medium** - Edge case handling

---

#### **TS_PRODUCT_11: Tạo sản phẩm với quantity = 0 (out of stock)**
- **Category:** Boundary Test - CREATE (Valid Edge Case)
- **Preconditions:** User on Add Product modal
- **Test Steps:**
  1. Enter title: "Out of Stock Product"
  2. Enter description: "Currently unavailable"
  3. Enter quantity: **0**
  4. Click "Save"
- **Expected Results:**
  - System accepts quantity = 0 (valid business case)
  - Product created successfully
  - Quantity displayed as 0 in list
  - Can be used to represent out-of-stock items
  - No validation error
- **Priority:** **Medium** - Business logic validation

---

#### **TS_PRODUCT_12: Tạo sản phẩm với quantity max (99,999)**
- **Category:** Boundary Test - CREATE
- **Preconditions:** User on Add Product modal
- **Test Steps:**
  1. Enter title: "Max Quantity Product"
  2. Enter quantity: **99999**
  3. Click "Save"
- **Expected Results:**
  - System accepts max quantity
  - Product created successfully
  - Quantity stored and displayed correctly as 99,999
  - No overflow or display issues
- **Priority:** **Medium** - Max boundary validation

---

#### **TS_PRODUCT_13: Tạo sản phẩm với quantity > max (> 99,999)**
- **Category:** Boundary Test - CREATE (Negative)
- **Preconditions:** User on Add Product modal
- **Test Steps:**
  1. Enter title: "Over Max Quantity"
  2. Enter quantity: **100000** (exceeds max)
  3. Click "Save"
- **Expected Results:**
  - Validation error: "Quantity must not exceed 99,999"
  - OR system caps at 99,999
  - Product not created with invalid quantity
  - Error message clear and actionable
- **Priority:** **Low** - Rare scenario

---

#### **TS_PRODUCT_14: Tạo sản phẩm với description vượt quá 500 ký tự**
- **Category:** Boundary Test - CREATE
- **Preconditions:** User on Add Product modal
- **Test Data:**
  - Description với 501+ characters
- **Test Steps:**
  1. Enter valid title and quantity
  2. Enter description với 600 characters
  3. Click "Save"
- **Expected Results:**
  - **Option 1:** Textarea maxLength prevents typing beyond 500
  - **Option 2:** Client validation shows character count and error
  - **Option 3:** Backend truncates to 500
  - **Option 4:** Backend rejects with validation error
  - Consistent behavior documented
- **Priority:** **Medium** - Field constraint

---

#### **TS_PRODUCT_15: Cập nhật sản phẩm không tồn tại (invalid product ID)**
- **Category:** Negative Test - UPDATE
- **Preconditions:**
  - Product ID = 999 does NOT exist in database
  - User somehow attempts to update it (manual API call or stale UI)
- **Test Steps:**
  1. Attempt API call: PUT /api/products/999
  2. Send valid product data in body
- **Expected Results:**
  - Backend searches for product with ID = 999
  - productRepository.findById(999) returns empty Optional
  - Throws ResourceNotFoundException
  - HTTP Status: **404 Not Found**
  - Error message: "Product not found"
  - No database changes
  - Frontend handles error gracefully
- **Priority:** **High** - Error handling critical

---

#### **TS_PRODUCT_16: Xóa sản phẩm không tồn tại (invalid product ID)**
- **Category:** Negative Test - DELETE
- **Preconditions:**
  - Product ID = 888 does NOT exist
- **Test Steps:**
  1. Attempt DELETE /api/products/888
- **Expected Results:**
  - Backend checks: productRepository.existsById(888) = false
  - Throws ResourceNotFoundException
  - HTTP Status: **404 Not Found**
  - Error message: "Product not found"
  - No database operation attempted
  - Frontend shows error notification
- **Priority:** **High** - Prevent silent failures

---

#### **TS_PRODUCT_17: Xem danh sách rỗng (user chưa có product nào)**
- **Category:** Edge Case - READ
- **Preconditions:**
  - User ID = 2 exists và đã đăng nhập
  - User chưa tạo product nào (products table empty for user_id = 2)
- **Test Steps:**
  1. Navigate to /users/2
  2. API call GET /api/products/2
- **Expected Results:**
  - HTTP Status: 200 OK
  - Response body: `[]` (empty array)
  - Frontend renders: "No items yet." message
  - Table header vẫn hiển thị
  - "Add Product" button visible và functional
  - No errors or blank page
- **Priority:** **Medium** - Good UX for new users

---

#### **TS_PRODUCT_18: Tạo sản phẩm trùng tên (duplicate title)**
- **Category:** Edge Case - CREATE
- **Preconditions:**
  - Product exists: ID = 1, title = "Laptop Dell"
  - User cố tạo product mới với cùng title
- **Test Steps:**
  1. Click "Add Product"
  2. Enter title: "Laptop Dell" (trùng với existing)
  3. Enter different description and quantity
  4. Click "Save"
- **Expected Results:**
  - **Current behavior:** System allows duplicate titles
    * No unique constraint trên title column
    * Both products tồn tại với cùng title nhưng khác ID
    * Valid for business (có thể có nhiều products cùng tên)
  - **Alternative:** If unique constraint added
    * Database constraint violation
    * 409 Conflict response
    * Error: "Product with this title already exists"
- **Priority:** **Low** - Business decision, not a bug

---

#### **TS_PRODUCT_19: Hủy bỏ thao tác xóa sản phẩm**
- **Category:** Edge Case - DELETE
- **Preconditions:**
  - Product exists: ID = 10
  - User viewing product list
- **Test Steps:**
  1. Click "Delete" button on product ID = 10
  2. Confirm dialog appears: "Are you sure?"
  3. Click **"Cancel"** button
- **Expected Results:**
  - `window.confirm()` returns false
  - Function returns early: `if (!window.confirm(...)) return;`
  - **No API call made** (verified in Network tab)
  - Product remains in list unchanged
  - No database modification
  - User can continue using the page normally
- **Priority:** **Medium** - User experience & safety

---

#### **TS_PRODUCT_20: Cập nhật product với userId không hợp lệ (Security Test)**
- **Category:** Security Test - UPDATE
- **Preconditions:**
  - User A (ID = 1) có product: ID = 5
  - User B (ID = 2) đã đăng nhập
- **Test Steps:**
  1. User B attempts: PUT /api/products/5
  2. Sends valid product data
- **Expected Results:**
  - **Current behavior (VULNERABLE):**
    * ❌ Update succeeds (security issue!)
    * User B can modify User A's product
    * No ownership check implemented
  - **Expected secure behavior:**
    * ✅ Backend checks product.user.id == currentUser.id
    * If not match: throw UnauthorizedException
    * HTTP Status: 403 Forbidden
    * Error: "You don't have permission to update this product"
    * No database changes
- **Priority:** **Critical** - Security vulnerability!

---

## c) Phân loại test scenarios theo mức độ ưu tiên và giải thích (1 điểm)

### **BẢNG PHÂN LOẠI THEO MỨC ĐỘ ƯU TIÊN**

| **Priority Level** | **Test Scenario IDs** | **Số lượng** | **% Tổng** |
|-------------------|----------------------|-------------|-----------|
| **Critical** | TS_PRODUCT_01, 02, 03, 04, 20 | 5 | 25% |
| **High** | TS_PRODUCT_05, 06, 07, 15, 16 | 5 | 25% |
| **Medium** | TS_PRODUCT_08, 09, 10, 11, 12, 14, 17, 19 | 8 | 40% |
| **Low** | TS_PRODUCT_13, 18 | 2 | 10% |
| **TỔNG** | | **20** | **100%** |

---

### **CRITICAL PRIORITY (5 scenarios - 25%)**

**Scenarios:** TS_PRODUCT_01, 02, 03, 04, 20

#### **Lý do phân loại Critical:**

**1. TS_PRODUCT_01 - CREATE thành công:**
   - **Core CRUD functionality:** Foundation của Product Management
   - **Business blocking:** Không tạo được product = không sử dụng được app
   - **User journey critical:** Đây là action đầu tiên user cần làm
   - **Revenue impact:** Direct impact to business operations
   - **Frequency:** High usage - users thường xuyên add products
   - **Dependencies:** Các test khác phụ thuộc vào CREATE hoạt động

**2. TS_PRODUCT_02 - READ danh sách:**
   - **Visibility critical:** User cần xem products để manage
   - **Most frequent operation:** Mỗi lần load page đều READ
   - **Data verification:** Xác nhận CREATE/UPDATE/DELETE hoạt động
   - **UX foundation:** Không xem được = không biết có gì
   - **Performance critical:** Slow READ = poor user experience

**3. TS_PRODUCT_03 - UPDATE thành công:**
   - **Core functionality:** Essential cho management
   - **Business requirement:** Thay đổi thông tin là common need
   - **Data accuracy:** Cập nhật inventory, pricing, descriptions
   - **User expectation:** Basic feature mọi CRUD app cần có

**4. TS_PRODUCT_04 - DELETE thành công:**
   - **Core functionality:** Complete CRUD operations
   - **Data management:** Remove obsolete/wrong products
   - **Storage management:** Clean up database
   - **User control:** Full control over their data

**5. TS_PRODUCT_20 - Security (Ownership check):**
   - **CRITICAL SECURITY VULNERABILITY:** User có thể modify data của người khác
   - **Data integrity:** Protect user data from unauthorized access
   - **Trust & compliance:** Data breach = legal issues
   - **Business reputation:** Security flaws = loss of trust
   - **Priority to fix:** Must be addressed immediately
   - **Attack vector:** Easy to exploit without auth check

**Testing Priority:**
- Test đầu tiên trong mỗi sprint
- Must pass 100% trước khi release
- Automated in CI/CD pipeline
- Regression test mandatory
- Security test (TS_20) blocking release

---

### **HIGH PRIORITY (5 scenarios - 25%)**

**Scenarios:** TS_PRODUCT_05, 06, 07, 15, 16

#### **Lý do phân loại High:**

**1. TS_PRODUCT_05 - Title rỗng:**
   - **Data validation:** Prevent invalid data entry
   - **Database integrity:** Title là required field
   - **User guidance:** Clear error helps user correct
   - **Common mistake:** Users có thể skip required fields
   - **Performance:** Client validation saves server resources

**2. TS_PRODUCT_06 - Quantity âm:**
   - **Business logic:** Negative inventory nonsensical
   - **Data consistency:** Must enforce >= 0 constraint
   - **Calculation errors:** Negative numbers cause issues in reports
   - **User error:** Easy typo (e.g., -10 instead of 10)

**3. TS_PRODUCT_07 - Title quá ngắn:**
   - **Quality control:** Enforce meaningful product names
   - **Search/filter:** Too short titles unhelpful
   - **User experience:** Descriptive names required
   - **Validation requirement:** Per specification (min 3 chars)

**4. TS_PRODUCT_15 - UPDATE product không tồn tại:**
   - **Error handling:** Graceful handling of edge case
   - **Race condition:** Product deleted while user editing
   - **User feedback:** Clear error vs silent failure
   - **Data integrity:** Don't update non-existent records
   - **Stale UI:** Handle out-of-sync frontend state

**5. TS_PRODUCT_16 - DELETE product không tồn tại:**
   - **Error handling:** Similar to TS_15
   - **Idempotency:** DELETE should be safe to retry
   - **User notification:** Inform user of current state
   - **Prevent confusion:** Clear feedback required

**Testing Priority:**
- Test sau Critical pass
- Include in smoke tests
- Automated validation tests
- Regular regression

---

### **MEDIUM PRIORITY (8 scenarios - 40%)**

**Scenarios:** TS_PRODUCT_08, 09, 10, 11, 12, 14, 17, 19

#### **Lý do phân loại Medium:**

**1. TS_PRODUCT_08, 09 - Boundary values (min/max length):**
   - **Validation testing:** Ensure limits work correctly
   - **Specification compliance:** Verify requirements met
   - **Not critical:** App still usable if slightly off
   - **Edge cases:** Rare in real usage
   - **Documentation:** Verify documented behavior

**2. TS_PRODUCT_10 - Title quá dài:**
   - **Edge case:** Uncommon scenario
   - **UI prevention:** Input maxLength usually prevents this
   - **Graceful handling:** Should handle but not critical
   - **UX improvement:** Better than critical function

**3. TS_PRODUCT_11 - Quantity = 0:**
   - **Business rule validation:** Valid use case (out of stock)
   - **Feature verification:** Ensure system allows it
   - **Not blocking:** Doesn't prevent normal operations
   - **Documentation:** Verify intended behavior

**4. TS_PRODUCT_12 - Quantity max:**
   - **Boundary test:** Verify max constraint
   - **Rare scenario:** Most products << 99,999
   - **System capacity:** Test high values
   - **Not critical:** Few users reach this limit

**5. TS_PRODUCT_14 - Description quá dài:**
   - **Field validation:** Ensure constraint respected
   - **Optional field:** Less critical than required fields
   - **UI handling:** Textarea can limit input
   - **UX feature:** Nice to have validation

**6. TS_PRODUCT_17 - Empty list:**
   - **UX testing:** Good user experience
   - **New user scenario:** Important for onboarding
   - **Not blocking:** Core features still work
   - **Message clarity:** "No items yet" helpful

**7. TS_PRODUCT_19 - Cancel delete:**
   - **User safety:** Prevent accidental deletion
   - **UX feature:** Good practice
   - **Low risk:** If fails, user just re-cancels
   - **Not critical:** Workaround available (close dialog)

**Testing Priority:**
- Test after High priority pass
- Include in full regression
- Can be delayed if timeline tight
- Automated tests (medium priority queue)

---

### **LOW PRIORITY (2 scenarios - 10%)**

**Scenarios:** TS_PRODUCT_13, 18

#### **Lý do phân loại Low:**

**1. TS_PRODUCT_13 - Quantity > max (> 99,999):**
   - **Extremely rare:** Very few real-world products have such quantity
   - **UI prevention:** Input type="number" with max attribute
   - **Backend safety:** Database column type limits
   - **Workaround:** User can use multiple products or adjust
   - **Low business impact:** Doesn't affect majority users
   - **Edge case:** Unlikely in production

**2. TS_PRODUCT_18 - Duplicate title:**
   - **By design:** System currently allows duplicates
   - **Not a bug:** No unique constraint implemented
   - **Business decision:** Intentional to allow same product names
   - **Valid use case:** Multiple variants of same product
   - **Low priority:** Only becomes issue if business changes requirement
   - **Easy to test:** Straightforward scenario

**Testing Priority:**
- Test last if time available
- Optional in regression
- Can skip for minor releases
- Document behavior for future reference

---

### **PRIORITY MATRIX & TESTING STRATEGY**

```
┌─────────────────────────────────────────────────────────────────┐
│           PRIORITY vs BUSINESS IMPACT & FREQUENCY                │
└─────────────────────────────────────────────────────────────────┘

        High Business Impact
            │
            │  ┌──────────────────────────────────┐
            │  │         CRITICAL                  │
            │  │  TS_01, 02, 03, 04 (CRUD)        │  ← Test FIRST
            │  │  TS_20 (Security)                 │     100% pass required
            │  └──────────────────────────────────┘     Blocking release
            │           │
            │  ┌──────────────────────────────────┐
            │  │           HIGH                    │
            │  │  TS_05, 06, 07 (Validation)      │  ← Test EARLY
            │  │  TS_15, 16 (Error Handling)      │     Smoke tests
            │  └──────────────────────────────────┘     Must pass
            │           │
            │  ┌──────────────────────────────────┐
            │  │          MEDIUM                   │
            │  │  TS_08-12, 14 (Boundaries)       │  ← Standard testing
            │  │  TS_17, 19 (Edge Cases/UX)       │     Full regression
            │  └──────────────────────────────────┘     Nice to have
            │           │
            │  ┌──────────────────────────────────┐
            │  │           LOW                     │
            │  │  TS_13 (Extreme boundary)        │  ← Optional testing
            │  │  TS_18 (Duplicate - by design)   │     Time permitting
            │  └──────────────────────────────────┘     Can defer
            │
        Low Business Impact
            └──────────────────────────────────────────►
                Low Frequency          High Frequency


CRUD Coverage:
CREATE: TS_01, 05-14, 18 (13 scenarios)
READ:   TS_02, 17 (2 scenarios)
UPDATE: TS_03, 15, 20 (3 scenarios)
DELETE: TS_04, 16, 19 (3 scenarios)
```

---

### **TESTING EXECUTION STRATEGY**

#### **Phase 1: Critical (MUST PASS)**
```
Week 1:
- TS_01: CREATE success
- TS_02: READ list
- TS_03: UPDATE success
- TS_04: DELETE success
- TS_20: Security check

Exit Criteria: 100% pass, no blockers
```

#### **Phase 2: High (SHOULD PASS)**
```
Week 2:
- TS_05-07: Input validation
- TS_15-16: Error handling

Exit Criteria: 90%+ pass, no high-severity bugs
```

#### **Phase 3: Medium (NICE TO HAVE)**
```
Week 3:
- TS_08-12, 14: Boundary tests
- TS_17, 19: Edge cases

Exit Criteria: 80%+ pass
```

#### **Phase 4: Low (OPTIONAL)**
```
Week 4:
- TS_13, 18: Low priority scenarios

Exit Criteria: Document behavior
```

---

### **AUTOMATION RECOMMENDATIONS**

| **Priority** | **Automation Level** | **Tools** | **Frequency** |
|-------------|---------------------|-----------|---------------|
| Critical | 100% automated | Cypress E2E, JUnit | Every commit |
| High | 100% automated | Jest, JUnit + Mockito | Every commit |
| Medium | 80% automated | Cypress, Unit tests | Daily build |
| Low | Manual or 50% | Manual QA | Weekly/Monthly |

---

**END OF PART 2**

**Next:** Part 3 sẽ có 5 Test Cases chi tiết theo template
