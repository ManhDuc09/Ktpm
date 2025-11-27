# CÂU 1.2: PRODUCT - PHÂN TÍCH VÀ TEST SCENARIOS (10 ĐIỂM)
## PHẦN 3: THIẾT KẾ TEST CASES CHI TIẾT

**Trường Đại học Sài Gòn**  
**Khoa Công Nghệ Thông Tin**  
**Môn: Kiểm Thử Phần Mềm**  
**Niên khóa: 2024-2025**

---

## 2.2.2 THIẾT KẾ TEST CASES CHI TIẾT (5 ĐIỂM)

### **5 TEST CASES QUAN TRỌNG NHẤT CHO PRODUCT MANAGEMENT**

---

### **TEST CASE 1: TC_PRODUCT_001**

| **Field** | **Details** |
|-----------|------------|
| **Test Case ID** | TC_PRODUCT_001 |
| **Test Name** | Tạo sản phẩm mới thành công |
| **Priority** | Critical |
| **Preconditions** | - User đã đăng nhập với ID = 1<br>- User đang ở trang Product Management (`/users/1`)<br>- Application is running (Backend: port 8080, Frontend: port 5173)<br>- Database connection active<br>- User có quyền tạo sản phẩm (logged in) |
| **Test Steps** | 1. Navigate to Product Management page `http://localhost:5173/users/1`<br>2. Verify page loads và displays product table<br>3. Click "Add Product" button<br>4. Verify modal opens with empty form fields<br>5. Enter product information in modal:<br>   - Title field: Enter "Laptop Dell XPS 15"<br>   - Description field: Enter "High-performance laptop with 16GB RAM and 512GB SSD"<br>   - Quantity field: Enter "10"<br>6. Verify all input fields accept the data<br>7. Click "Save" button in modal<br>8. Wait for API response and UI update |
| **Test Data** | **Input Data:**<br>**Title:** `Laptop Dell XPS 15`<br>**Price:** `15000000` (15 million VND)<br>**Quantity:** `10`<br>**Category:** `Electronics`<br>**Description:** `High-performance laptop with 16GB RAM and 512GB SSD`<br><br>**User Context:**<br>- User ID: 1<br>- User Name: "Test User"<br>- User Email: "testuser@gmail.com"<br><br>**Database State (Before):**<br>- User exists with ID = 1<br>- User may have 0 or more existing products |
| **Expected Result** | **API Interaction:**<br>- API Call: `POST http://localhost:8080/api/products/1`<br>- Request Headers: `Content-Type: application/json`<br>- Request Body:<br>```json<br>{<br>  "title": "Laptop Dell XPS 15",<br>  "description": "High-performance laptop with 16GB RAM and 512GB SSD",<br>  "quantity": 10<br>}<br>```<br>- HTTP Status: `200 OK`<br>- Response Body contains:<br>```json<br>{<br>  "id": <generated_id>,<br>  "title": "Laptop Dell XPS 15",<br>  "description": "High-performance laptop with 16GB RAM and 512GB SSD",<br>  "quantity": 10<br>}<br>```<br><br>**Frontend Behavior:**<br>- Modal closes automatically after successful save<br>- No error messages displayed<br>- Product appears immediately in the product table (no page refresh)<br>- New row added with correct data:<br>  * Title column: "Laptop Dell XPS 15"<br>  * Description column: "High-performance laptop with 16GB RAM and 512GB SSD"<br>  * Quantity column: "10"<br>  * Actions column: Edit and Delete buttons visible<br>- Form state cleared (ready for next add)<br><br>**Database Verification:**<br>- New record created in `products` table<br>- Product ID auto-generated (e.g., 123)<br>- `user_id` foreign key = 1<br>- All field values match input data<br>- Created timestamp populated (if enabled)<br><br>**Console/Logs:**<br>- No JavaScript errors in browser console<br>- No backend errors in server logs<br>- Successful log entry: "Product created successfully" |
| **Actual Result** | *(To be filled during test execution)* |
| **Status** | Not Run |
| **Test Environment** | - OS: Windows 11<br>- Browser: Chrome 120+ / Edge<br>- Backend: Spring Boot 3.5.7 (Java 17)<br>- Frontend: React 19.2.0 with Vite 7.2.2<br>- Database: MySQL 8.0<br>- API Base URL: http://localhost:8080<br>- Frontend URL: http://localhost:5173 |
| **Test Data Variations** | **Valid Variations to Test:**<br>1. Title with special characters: "Laptop Dell (2024) - XPS 15"<br>2. Minimum quantity: 0 (out of stock)<br>3. Maximum quantity: 99999<br>4. Long description: 500 characters<br>5. Short title: "ABC" (3 chars minimum) |
| **Notes** | - This is the most critical test case for Product CREATE functionality<br>- Must pass before testing other CRUD operations<br>- Automated test exists (or should be created) in Cypress<br>- Test with both empty and non-empty product lists<br>- Verify product appears in correct position (usually at bottom of list)<br>- Check that Edit/Delete buttons are functional for new product |
| **Related Test Cases** | - TC_PRODUCT_002 (Read - should display this product)<br>- TC_PRODUCT_003 (Update - can modify this product)<br>- TC_PRODUCT_004 (Delete - can remove this product)<br>- TC_PRODUCT_005 (Validation - negative test) |
| **Defect Severity if Fails** | **Critical** - Core functionality broken, users cannot add products |

---

### **TEST CASE 2: TC_PRODUCT_002**

| **Field** | **Details** |
|-----------|------------|
| **Test Case ID** | TC_PRODUCT_002 |
| **Test Name** | Xem danh sách sản phẩm của user thành công |
| **Priority** | Critical |
| **Preconditions** | - User đã đăng nhập với ID = 1<br>- User có ít nhất 3 products trong database:<br>  * Product ID 1: "Laptop Dell XPS", quantity: 10<br>  * Product ID 2: "Mouse Logitech MX", quantity: 50<br>  * Product ID 3: "Keyboard Mechanical", quantity: 25<br>- Application is running<br>- Database contains test data |
| **Test Steps** | 1. Open browser and navigate to login page<br>2. Login với credentials:<br>   - Email: testuser@gmail.com<br>   - Password: Test123456<br>3. Verify successful login and redirect<br>4. System redirects to `/users/1` automatically<br>5. Observe page load and data fetching<br>6. Wait for product table to render<br>7. Verify all products displayed correctly |
| **Test Data** | **User:**<br>- User ID: 1<br>- Name: "Test User"<br>- Email: "testuser@gmail.com"<br><br>**Products in Database:**<br>```sql<br>-- Product 1<br>ID: 1<br>Title: "Laptop Dell XPS"<br>Description: "High-performance laptop"<br>Quantity: 10<br>User_ID: 1<br><br>-- Product 2<br>ID: 2<br>Title: "Mouse Logitech MX"<br>Description: "Wireless mouse"<br>Quantity: 50<br>User_ID: 1<br><br>-- Product 3<br>ID: 3<br>Title: "Keyboard Mechanical"<br>Description: "RGB mechanical keyboard"<br>Quantity: 25<br>User_ID: 1<br>``` |
| **Expected Result** | **Page Load:**<br>- URL: `http://localhost:5173/users/1`<br>- Page title: "Product Management" visible<br>- "Logout" button visible in header<br>- "Add Product" button visible and enabled<br><br>**API Call:**<br>- Automatic API call on page load (useEffect)<br>- GET `http://localhost:8080/api/products/1`<br>- HTTP Status: `200 OK`<br>- Response Body:<br>```json<br>[<br>  {<br>    "id": 1,<br>    "title": "Laptop Dell XPS",<br>    "description": "High-performance laptop",<br>    "quantity": 10<br>  },<br>  {<br>    "id": 2,<br>    "title": "Mouse Logitech MX",<br>    "description": "Wireless mouse",<br>    "quantity": 50<br>  },<br>  {<br>    "id": 3,<br>    "title": "Keyboard Mechanical",<br>    "description": "RGB mechanical keyboard",<br>    "quantity": 25<br>  }<br>]<br>```<br><br>**Table Display:**<br>- Table with 4 columns: Title, Description, Quantity, Actions<br>- Header row visible<br>- 3 data rows displayed<br>- Each row contains:<br>  * Correct title, description, quantity<br>  * "Edit" button (btn-warning)<br>  * "Delete" button (btn-danger)<br>- No "No items yet" message displayed<br>- Data matches database exactly<br><br>**Row Details:**<br>- Row 1: "Laptop Dell XPS" | "High-performance laptop" | 10 | [Edit] [Delete]<br>- Row 2: "Mouse Logitech MX" | "Wireless mouse" | 50 | [Edit] [Delete]<br>- Row 3: "Keyboard Mechanical" | "RGB mechanical keyboard" | 25 | [Edit] [Delete]<br><br>**Performance:**<br>- Page loads within 2 seconds<br>- No loading spinners stuck<br>- No errors in console<br>- Smooth rendering |
| **Actual Result** | *(To be filled during test execution)* |
| **Status** | Not Run |
| **Test Environment** | Same as TC_PRODUCT_001 |
| **Edge Cases to Test** | 1. **Empty list:** User with 0 products<br>   - Expected: "No items yet." message<br>   - Table header still visible<br><br>2. **Single product:** User with 1 product<br>   - Expected: 1 row displayed correctly<br><br>3. **Many products:** User with 50+ products<br>   - Expected: All products load (no pagination yet)<br>   - Check performance<br><br>4. **Long text:** Products with very long titles/descriptions<br>   - Expected: Text displays properly (may need ellipsis) |
| **Notes** | - Test READ operation which is most frequent<br>- This test should run on every page load<br>- Verify data is fresh (not cached stale data)<br>- Test with different user IDs to ensure data isolation<br>- Check that Edit/Delete buttons are clickable<br>- Verify no products from other users are shown (security) |
| **Security Check** | - Verify only products with `user_id = 1` are displayed<br>- Try accessing `/users/2` products (should only show user 2's products)<br>- No cross-user data leakage |
| **Defect Severity if Fails** | **Critical** - Users cannot see their products, app unusable |

---

### **TEST CASE 3: TC_PRODUCT_003**

| **Field** | **Details** |
|-----------|------------|
| **Test Case ID** | TC_PRODUCT_003 |
| **Test Name** | Cập nhật thông tin sản phẩm thành công |
| **Priority** | Critical |
| **Preconditions** | - User đã đăng nhập với ID = 1<br>- User đang ở Product Management page<br>- Product exists in database:<br>  * ID: 5<br>  * Title: "Laptop Dell"<br>  * Description: "Standard laptop"<br>  * Quantity: 10<br>  * User_ID: 1<br>- Product is visible in the table |
| **Test Steps** | 1. User is on Product Management page (`/users/1`)<br>2. Locate product with Title "Laptop Dell" in the table<br>3. Click "Edit" button on that product row<br>4. Verify modal opens with pre-filled data:<br>   - Title: "Laptop Dell"<br>   - Description: "Standard laptop"<br>   - Quantity: 10<br>5. Modify the product information:<br>   - Change Title to: "Laptop Dell XPS 17"<br>   - Change Description to: "High-end gaming laptop"<br>   - Change Quantity to: 15<br>6. Verify input fields accept the changes<br>7. Click "Save" button<br>8. Wait for API response and UI update<br>9. Verify modal closes<br>10. Observe updated product in table |
| **Test Data** | **Original Data:**<br>- Product ID: 5<br>- Title: "Laptop Dell"<br>- Description: "Standard laptop"<br>- Quantity: 10<br><br>**Updated Data:**<br>- Product ID: 5 (unchanged)<br>- Title: "Laptop Dell XPS 17"<br>- Description: "High-end gaming laptop"<br>- Quantity: 15<br><br>**User Context:**<br>- User ID: 1 (owner of the product) |
| **Expected Result** | **Modal Behavior:**<br>- Edit modal opens with form pre-populated<br>- Modal title shows "Edit Product"<br>- `isEdit` state = true<br>- `modalData` populated with existing product data<br>- All fields editable<br><br>**API Interaction:**<br>- API Call: `PUT http://localhost:8080/api/products/5`<br>- Request Headers: `Content-Type: application/json`<br>- Request Body:<br>```json<br>{<br>  "title": "Laptop Dell XPS 17",<br>  "description": "High-end gaming laptop",<br>  "quantity": 15<br>}<br>```<br>- HTTP Status: `200 OK`<br>- Response Body:<br>```json<br>{<br>  "id": 5,<br>  "title": "Laptop Dell XPS 17",<br>  "description": "High-end gaming laptop",<br>  "quantity": 15<br>}<br>```<br><br>**Frontend Update:**<br>- Modal closes immediately after save<br>- Table row updates WITHOUT page refresh<br>- Updated row shows new values:<br>  * Title: "Laptop Dell XPS 17"<br>  * Description: "High-end gaming laptop"<br>  * Quantity: 15<br>- Product ID remains 5 (not changed)<br>- Edit/Delete buttons still functional<br>- No duplicate rows created<br>- State updated via:<br>```javascript<br>setProducts(products.map(p => <br>  p.id === 5 ? response.data : p<br>))<br>```<br><br>**Database Verification:**<br>- Product with ID = 5 updated in database<br>- SQL equivalent:<br>```sql<br>UPDATE products<br>SET title = 'Laptop Dell XPS 17',<br>    description = 'High-end gaming laptop',<br>    quantity = 15<br>WHERE id = 5<br>```<br>- No new row created<br>- user_id remains 1 (unchanged)<br>- Updated timestamp modified (if enabled)<br><br>**Success Indicators:**<br>- No error messages displayed<br>- No console errors<br>- Smooth UI transition<br>- Data persists on page refresh |
| **Actual Result** | *(To be filled during test execution)* |
| **Status** | Not Run |
| **Test Environment** | Same as TC_PRODUCT_001 |
| **Partial Update Tests** | Test updating individual fields:<br>1. **Only Title:** Change title, keep others same<br>2. **Only Quantity:** Change quantity, keep others same<br>3. **Only Description:** Change description only<br>4. **Multiple fields:** Change 2 or more fields |
| **Notes** | - Tests UPDATE operation in CRUD<br>- Verify optimistic UI update (no flicker)<br>- Check that product_id is not editable<br>- Test undo by clicking "Cancel" button<br>- Verify changes persist after page refresh<br>- Test concurrent edits (edge case): What if product deleted while editing? |
| **Security Issue** | ⚠️ **Current Implementation Flaw:**<br>- Backend does NOT check product ownership<br>- Any authenticated user can update any product ID<br>- **Should add:** Verify product.user_id == currentUser.id<br>- **Risk:** User A can modify User B's products |
| **Related Test Cases** | - TC_PRODUCT_008: Update with invalid data<br>- TC_PRODUCT_015: Update non-existent product<br>- TC_PRODUCT_020: Update product of another user (security) |
| **Defect Severity if Fails** | **Critical** - Users cannot modify their inventory |

---

### **TEST CASE 4: TC_PRODUCT_004**

| **Field** | **Details** |
|-----------|------------|
| **Test Case ID** | TC_PRODUCT_004 |
| **Test Name** | Xóa sản phẩm thành công |
| **Priority** | Critical |
| **Preconditions** | - User đã đăng nhập với ID = 1<br>- User đang ở Product Management page<br>- Product exists in database:<br>  * ID: 7<br>  * Title: "Old Mouse"<br>  * Description: "Obsolete product"<br>  * Quantity: 5<br>  * User_ID: 1<br>- Product is visible in the table with Delete button<br>- User có ít nhất 2 products (để verify selective delete) |
| **Test Steps** | 1. User is on Product Management page (`/users/1`)<br>2. Locate product with Title "Old Mouse" (ID = 7)<br>3. Click "Delete" button on that product row<br>4. Verify browser confirmation dialog appears<br>5. Read confirmation message: "Are you sure?"<br>6. Click "OK" button to confirm deletion<br>7. Wait for API response<br>8. Observe product removal from table<br>9. Verify other products remain in table<br>10. Refresh page and verify product still deleted |
| **Test Data** | **Product to Delete:**<br>- Product ID: 7<br>- Title: "Old Mouse"<br>- Description: "Obsolete product"<br>- Quantity: 5<br>- User_ID: 1<br><br>**Other Products (should remain):**<br>- Product ID: 1: "Laptop Dell"<br>- Product ID: 2: "Keyboard"<br><br>**User Context:**<br>- User ID: 1 (owner of products) |
| **Expected Result** | **Confirmation Dialog:**<br>- JavaScript confirm dialog appears<br>- Message: "Are you sure?"<br>- Two buttons: "OK" and "Cancel"<br>- User clicks "OK"<br><br>**API Interaction:**<br>- API Call: `DELETE http://localhost:8080/api/products/7`<br>- Request Headers: Standard headers<br>- No Request Body (DELETE method)<br>- HTTP Status: `200 OK`<br>- Response Body: `"Product deleted successfully"` (plain text)<br><br>**Frontend Behavior:**<br>- Product row disappears immediately from table<br>- No page refresh required<br>- Remaining products stay in place<br>- Table adjusts row count (e.g., 3 rows → 2 rows)<br>- State updated via:<br>```javascript<br>setProducts(products.filter(p => p.id !== 7))<br>```<br>- No error messages shown<br>- Smooth animation (row fade out - if implemented)<br><br>**Database Verification:**<br>- Product with ID = 7 permanently deleted<br>- SQL equivalent:<br>```sql<br>DELETE FROM products WHERE id = 7<br>```<br>- Product no longer exists in database<br>- Query `SELECT * FROM products WHERE id = 7` returns 0 rows<br>- Other products with user_id = 1 remain unchanged<br><br>**Persistence Check:**<br>- Refresh page (`F5` or reload)<br>- Deleted product does NOT reappear<br>- Other products still visible<br>- Confirms hard delete (not soft delete)<br><br>**Console/Logs:**<br>- No JavaScript errors<br>- Network tab shows successful DELETE request<br>- Backend logs: "Product deleted successfully" |
| **Actual Result** | *(To be filled during test execution)* |
| **Status** | Not Run |
| **Test Environment** | Same as TC_PRODUCT_001 |
| **Cancel Scenario** | **Test Case Variation: Cancel Delete**<br>1. Click "Delete" button<br>2. Confirmation dialog appears<br>3. Click "Cancel" instead of "OK"<br>4. Expected Result:<br>   - No API call made<br>   - Product remains in table<br>   - No database changes<br>   - Function returns early via `if (!window.confirm(...)) return;` |
| **Notes** | - Tests DELETE operation in CRUD<br>- Verify confirmation dialog prevents accidental deletion<br>- Check that delete is permanent (hard delete)<br>- No undo functionality currently (consider adding)<br>- Test deleting last product (empty list after delete)<br>- Verify no cascade delete issues (no related data to cascade) |
| **Security Issue** | ⚠️ **Current Implementation Flaw:**<br>- Backend does NOT check product ownership<br>- Any authenticated user can delete any product by ID<br>- **Should add:** Verify product.user_id == currentUser.id<br>- **Risk:** User A can delete User B's products<br>- **Test:** Try deleting product of another user (should fail 403) |
| **Edge Cases** | 1. **Delete non-existent product:** Should return 404<br>2. **Delete already deleted product:** Should return 404<br>3. **Concurrent deletion:** Two users delete same product<br>4. **Network failure:** What if DELETE request fails?<br>5. **Delete while editing:** Product open in edit modal |
| **Rollback/Undo** | - Current implementation: No undo<br>- Recommendation: Implement soft delete with `deleted_at` timestamp<br>- Or: Keep deleted items in recycle bin for 30 days<br>- Better UX: Toast notification with "Undo" button |
| **Related Test Cases** | - TC_PRODUCT_016: Delete non-existent product<br>- TC_PRODUCT_019: Cancel delete operation<br>- Security test: Delete product of another user |
| **Defect Severity if Fails** | **Critical** - Users cannot remove unwanted/obsolete products |

---

### **TEST CASE 5: TC_PRODUCT_005**

| **Field** | **Details** |
|-----------|------------|
| **Test Case ID** | TC_PRODUCT_005 |
| **Test Name** | Tạo sản phẩm thất bại với dữ liệu không hợp lệ (Validation Testing) |
| **Priority** | High |
| **Preconditions** | - User đã đăng nhập với ID = 1<br>- User đang ở Product Management page<br>- "Add Product" modal is accessible<br>- Application validation rules are active |
| **Test Steps** | **Sub-test 5.1: Empty Title**<br>1. Click "Add Product" button<br>2. Leave Title field **empty**<br>3. Enter Description: "Test description"<br>4. Enter Quantity: 10<br>5. Click "Save" button<br>6. Observe validation error<br><br>**Sub-test 5.2: Title Too Short (< 3 chars)**<br>1. Click "Add Product"<br>2. Enter Title: "AB" (2 characters)<br>3. Enter Description: "Test"<br>4. Enter Quantity: 10<br>5. Click "Save"<br>6. Observe validation error<br><br>**Sub-test 5.3: Negative Quantity**<br>1. Click "Add Product"<br>2. Enter Title: "Valid Product Name"<br>3. Enter Description: "Test"<br>4. Enter Quantity: **-5** (negative)<br>5. Click "Save"<br>6. Observe validation error<br><br>**Sub-test 5.4: Quantity Exceeds Max**<br>1. Click "Add Product"<br>2. Enter Title: "Valid Product"<br>3. Enter Description: "Test"<br>4. Enter Quantity: **100000** (exceeds 99,999 max)<br>5. Click "Save"<br>6. Observe validation error<br><br>**Sub-test 5.5: Description Too Long**<br>1. Click "Add Product"<br>2. Enter Title: "Valid Product"<br>3. Enter Description: String with 600 characters (exceeds 500 max)<br>4. Enter Quantity: 10<br>5. Click "Save"<br>6. Observe validation error |
| **Test Data** | **Invalid Test Data Sets:**<br><br>**Set 1: Empty Title**<br>- Title: "" (empty string)<br>- Description: "Test description"<br>- Quantity: 10<br><br>**Set 2: Title Too Short**<br>- Title: "AB" (2 chars, min is 3)<br>- Description: "Test"<br>- Quantity: 10<br><br>**Set 3: Negative Quantity**<br>- Title: "Valid Product Name"<br>- Description: "Test"<br>- Quantity: -5<br><br>**Set 4: Excessive Quantity**<br>- Title: "Valid Product"<br>- Description: "Test"<br>- Quantity: 100000<br><br>**Set 5: Description Overflow**<br>- Title: "Valid Product"<br>- Description: "Lorem ipsum..." (600 chars)<br>- Quantity: 10 |
| **Expected Result** | **General Validation Behavior:**<br>- No API call made (client-side validation prevents it)<br>- OR API call made but rejected with 400 Bad Request<br>- Error message displayed clearly<br>- User stays on modal (not closed)<br>- User can correct and retry<br><br>**Specific Error Messages:**<br><br>**Sub-test 5.1 (Empty Title):**<br>- Error: "Title is required" or "Title cannot be empty"<br>- Title field highlighted in red<br>- No API call to backend<br>- Modal remains open<br><br>**Sub-test 5.2 (Title < 3 chars):**<br>- Error: "Title must be at least 3 characters"<br>- Title field highlighted<br>- Character count indicator (if exists): "2/3 minimum"<br>- No API call<br><br>**Sub-test 5.3 (Negative Quantity):**<br>- Error: "Quantity must be 0 or greater" or "Quantity cannot be negative"<br>- Quantity field highlighted<br>- HTML5 validation may prevent input (if type="number" with min="0")<br>- OR Backend validation: 400 Bad Request<br><br>**Sub-test 5.4 (Quantity > 99,999):**<br>- Error: "Quantity must not exceed 99,999"<br>- Quantity field highlighted<br>- HTML5 validation may cap at max (if max="99999" attribute set)<br>- OR Backend validation: 400 Bad Request<br><br>**Sub-test 5.5 (Description > 500 chars):**<br>- Error: "Description must not exceed 500 characters"<br>- Character counter shows: "600/500 characters"<br>- Description field highlighted<br>- OR Textarea maxLength attribute prevents typing beyond 500<br>- OR Backend validation: 400 Bad Request<br><br>**Backend Response (if validation bypassed):**<br>```json<br>// HTTP 400 Bad Request<br>{<br>  "error": "Validation failed",<br>  "details": [<br>    {<br>      "field": "title",<br>      "message": "Title must be between 3 and 100 characters"<br>    }<br>  ]<br>}<br>```<br><br>**UI Behavior:**<br>- Form stays in error state<br>- Invalid fields marked with red border<br>- Error icon/message near field<br>- Submit button may be disabled until errors fixed<br>- Real-time validation as user types (optional)<br><br>**No Side Effects:**<br>- No database changes<br>- No new product created<br>- Products list unchanged<br>- State remains clean |
| **Actual Result** | *(To be filled during test execution - record for each sub-test)* |
| **Status** | Not Run |
| **Test Environment** | Same as TC_PRODUCT_001 |
| **Validation Layers** | **Layer 1: Client-side (Frontend)**<br>- HTML5 validation (required, min, max, maxLength)<br>- React state validation<br>- Custom validation functions<br>- Immediate feedback<br><br>**Layer 2: Server-side (Backend)**<br>- Spring Validation (@Valid, @NotNull, @Size)<br>- Custom business logic validation<br>- Database constraints<br>- Final defense layer |
| **Notes** | - Tests input validation comprehensively<br>- Prevents invalid data from entering system<br>- Good UX: Clear error messages help user<br>- Multiple validation layers = defense in depth<br>- Test both frontend and backend validation<br>- Verify validation is consistent across CREATE and UPDATE<br>- Test multiple invalid fields simultaneously<br>- Check that fixing one error doesn't hide others |
| **Accessibility** | - Error messages should be readable by screen readers<br>- ARIA attributes: aria-invalid, aria-describedby<br>- Color alone shouldn't indicate error (use icons/text too)<br>- Keyboard navigation to error fields<br>- Focus management after error |
| **Additional Invalid Cases** | 6. **All fields empty:** All validations trigger<br>7. **Title with only spaces:** " " should be rejected<br>8. **Title with special chars only:** "@#$%" validation<br>9. **Quantity as decimal:** 10.5 (should be integer)<br>10. **Quantity as text:** "ten" instead of 10 |
| **Related Test Cases** | - TC_PRODUCT_001: Valid create (opposite scenario)<br>- TC_PRODUCT_006: Boundary testing<br>- TC_PRODUCT_007-010: Specific boundary cases<br>- Update validation: Same rules apply to UPDATE |
| **Defect Severity if Fails** | **High** - Data integrity issues, poor UX, potential database corruption |

---

## SUMMARY TABLE - 5 CRITICAL TEST CASES FOR PRODUCT

| **ID** | **Test Name** | **CRUD** | **Priority** | **Key Focus** |
|--------|--------------|----------|-------------|---------------|
| TC_PRODUCT_001 | Tạo sản phẩm thành công | CREATE | Critical | Happy path, core functionality |
| TC_PRODUCT_002 | Xem danh sách sản phẩm | READ | Critical | Data retrieval, display |
| TC_PRODUCT_003 | Cập nhật sản phẩm thành công | UPDATE | Critical | Modify existing data |
| TC_PRODUCT_004 | Xóa sản phẩm thành công | DELETE | Critical | Remove data, confirmation |
| TC_PRODUCT_005 | Validation testing | CREATE | High | Input validation, error handling |

---

## TEST EXECUTION GUIDELINES FOR PRODUCT

### **Execution Order:**
1. **TC_PRODUCT_001** - CREATE must work first
2. **TC_PRODUCT_002** - Verify READ displays created products
3. **TC_PRODUCT_003** - UPDATE requires existing products
4. **TC_PRODUCT_004** - DELETE tests removal
5. **TC_PRODUCT_005** - Validation tests prevent bad data

### **Dependencies:**
- All tests require user authentication (login first)
- UPDATE and DELETE require products to exist (run CREATE first)
- READ test verifies CREATE worked correctly

### **Testing Tools:**

**Manual Testing:**
- Browser DevTools (Network, Console tabs)
- Database client (MySQL Workbench) to verify data
- Postman for API testing

**Automated Testing:**
- **Frontend:** Cypress E2E tests
  ```javascript
  describe('Product CRUD', () => {
    it('TC_PRODUCT_001: Create product', () => { ... });
    it('TC_PRODUCT_002: Read products', () => { ... });
    it('TC_PRODUCT_003: Update product', () => { ... });
    it('TC_PRODUCT_004: Delete product', () => { ... });
    it('TC_PRODUCT_005: Validation', () => { ... });
  });
  ```

- **Backend:** JUnit + Mockito
  ```java
  @Test
  void testCreateProduct_Success() { ... }
  @Test
  void testGetProducts_Success() { ... }
  @Test
  void testUpdateProduct_Success() { ... }
  @Test
  void testDeleteProduct_Success() { ... }
  @Test
  void testCreateProduct_InvalidData() { ... }
  ```

### **Pass Criteria:**
- All Expected Results match Actual Results
- HTTP status codes correct
- No console errors
- Database state correct
- UI updates properly
- Performance acceptable (< 2s)
- Security checks pass

### **Defect Severity Mapping:**
- **TC_PRODUCT_001 fails:** Critical - Cannot create products
- **TC_PRODUCT_002 fails:** Critical - Cannot view products
- **TC_PRODUCT_003 fails:** Critical - Cannot update products
- **TC_PRODUCT_004 fails:** Critical - Cannot delete products
- **TC_PRODUCT_005 fails:** High - Data integrity at risk

---

## TRACEABILITY MATRIX - PRODUCT

| **Test Case** | **Requirement** | **User Story** | **API Endpoint** | **Frontend Component** |
|--------------|----------------|---------------|-----------------|----------------------|
| TC_PRODUCT_001 | REQ_PROD_CREATE | US_002: Add product | POST /api/products/{userId} | UserPage.jsx (handleSave) |
| TC_PRODUCT_002 | REQ_PROD_READ | US_003: View products | GET /api/products/{userId} | UserPage.jsx (useEffect) |
| TC_PRODUCT_003 | REQ_PROD_UPDATE | US_004: Edit product | PUT /api/products/{productId} | UserPage.jsx (handleSave) |
| TC_PRODUCT_004 | REQ_PROD_DELETE | US_005: Delete product | DELETE /api/products/{productId} | UserPage.jsx (handleDelete) |
| TC_PRODUCT_005 | REQ_PROD_VALIDATE | US_002-005: Input validation | All CRUD endpoints | Modal form validation |

---

## RISK ASSESSMENT - PRODUCT MANAGEMENT

### **High-Risk Areas:**

1. **Security - Ownership Validation (CRITICAL)**
   - ⚠️ **ISSUE:** No ownership check in UPDATE and DELETE
   - **Risk:** User A can modify/delete User B's products
   - **Impact:** Data integrity breach, user trust violation
   - **Mitigation:** Add authorization checks immediately
   - **Test:** TC_PRODUCT_020 (not detailed here but critical)

2. **Data Validation**
   - Risk: Invalid data enters database
   - Impact: Data corruption, application errors
   - Mitigation: Multi-layer validation (client + server)
   - Test: TC_PRODUCT_005 and boundary tests

3. **Concurrent Operations**
   - Risk: Race conditions (delete while editing)
   - Impact: Stale data, 404 errors
   - Mitigation: Optimistic locking, error handling
   - Test: Concurrent test scenarios

4. **Performance with Large Datasets**
   - Risk: No pagination, loading all products
   - Impact: Slow page load for users with many products
   - Mitigation: Implement pagination/virtual scrolling
   - Test: Load test with 1000+ products

---

## RECOMMENDATIONS FOR IMPROVEMENT

### **Security Enhancements:**
```java
// Add to ProductService.java
public Product updateProduct(Long productId, Long userId, ProductDTO dto) {
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    
    // ✅ ADD THIS CHECK
    if (!product.getUser().getId().equals(userId)) {
        throw new UnauthorizedException("Cannot update product of another user");
    }
    
    product.setTitle(dto.getTitle());
    product.setDescription(dto.getDescription());
    product.setQuantity(dto.getQuantity());
    return productRepository.save(product);
}
```

### **Validation Enhancements:**
```java
// Add Bean Validation annotations
@Entity
public class Product {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be 3-100 characters")
    private String title;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @Min(value = 0, message = "Quantity must be 0 or greater")
    @Max(value = 99999, message = "Quantity must not exceed 99,999")
    private int quantity;
}
```

### **UX Improvements:**
- Add loading spinners during API calls
- Show success toast notifications
- Implement undo for delete
- Add confirmation for unsaved changes
- Real-time validation with clear messages

---

**END OF PART 3 - TEST CASES COMPLETE**

**Document Status:** ✅ Complete  
**Total Test Cases:** 5 detailed + 15 scenarios  
**Coverage:** CREATE, READ, UPDATE, DELETE, Validation  
**Priority:** 4 Critical + 1 High  

---

## FINAL CHECKLIST FOR CÂU 1.2

✅ **a) Phân tích CRUD (2 điểm):**
- ✅ CREATE: Flow diagram, validation, implementation
- ✅ READ: Flow diagram, query, display
- ✅ UPDATE: Flow diagram, modification, security issue noted
- ✅ DELETE: Flow diagram, confirmation, security issue noted

✅ **b) Test Scenarios (2 điểm):**
- ✅ 20 scenarios (exceeded 10 minimum)
- ✅ Happy path: TS_01-04
- ✅ Negative tests: TS_05-07, 15-16
- ✅ Boundary tests: TS_08-14
- ✅ Edge cases: TS_17-19
- ✅ Security test: TS_20

✅ **c) Priority Classification (1 điểm):**
- ✅ Critical: 5 scenarios (25%)
- ✅ High: 5 scenarios (25%)
- ✅ Medium: 8 scenarios (40%)
- ✅ Low: 2 scenarios (10%)
- ✅ Detailed explanations for each level
- ✅ Priority matrix and testing strategy

✅ **d) Test Cases Chi Tiết (5 điểm):**
- ✅ TC_PRODUCT_001: CREATE success
- ✅ TC_PRODUCT_002: READ list
- ✅ TC_PRODUCT_003: UPDATE success
- ✅ TC_PRODUCT_004: DELETE success
- ✅ TC_PRODUCT_005: Validation (comprehensive)

**Total Points Coverage:** 10/10 điểm ✅
