# CÂU 1.2: PRODUCT - PHÂN TÍCH VÀ TEST SCENARIOS (10 ĐIỂM)
## PHẦN 1: PHÂN TÍCH YÊU CẦU CHỨC NĂNG

**Trường Đại học Sài Gòn**  
**Khoa Công Nghệ Thông Tin**  
**Môn: Kiểm Thử Phần Mềm**  
**Niên khóa: 2024-2025**

---

## 2.2.1 YÊU CẦU (5 ĐIỂM)

### a) Phân tích đầy đủ các yêu cầu chức năng của Product CRUD (2 điểm)

Dựa trên phân tích source code (`ProductController.java`, `ProductService.java`, `UserPage.jsx`, `Product.java`), hệ thống Product Management cung cấp đầy đủ CRUD operations với các validation rules nghiêm ngặt.

---

## 1. CREATE - THÊM SẢN PHẨM MỚI

### **Functional Requirements:**

| **Aspect** | **Requirement** | **Details** |
|------------|----------------|-------------|
| **Endpoint** | `POST /api/products/{userId}` | Tạo product mới cho user cụ thể |
| **Authentication** | Required | User phải đã đăng nhập |
| **Authorization** | User-specific | Product thuộc về user đã login |
| **Input Fields** | title, description, quantity | Tất cả fields required theo business logic |
| **Response** | Product object | Trả về product vừa tạo với ID |
| **Side Effects** | Database insertion | Product saved vào DB, linked với User |

### **Validation Rules - CREATE:**

| **Field** | **Rule** | **Description** | **Implementation** |
|-----------|----------|-----------------|-------------------|
| **Title** | 3-100 ký tự | - Min: 3 characters<br>- Max: 100 characters<br>- Không được rỗng<br>- Trim spaces | Frontend: Input validation<br>Backend: String length check |
| **Description** | ≤ 500 ký tự | - Max: 500 characters<br>- Có thể rỗng (optional)<br>- Trim spaces | Frontend: Textarea maxLength<br>Backend: Length validation |
| **Quantity** | 0 - 99,999 | - Min: 0 (có thể out of stock)<br>- Max: 99,999<br>- Integer only<br>- Non-negative | Frontend: `type="number"`<br>Backend: Range validation |
| **Price** | > 0, ≤ 999,999,999 | - Min: > 0 (không free)<br>- Max: 999,999,999<br>- Must be positive<br>- Decimal allowed | **Note:** Hiện tại chưa implement trong code<br>Cần thêm field |
| **Category** | From predefined list | - Must exist in categories<br>- Cannot be custom<br>- Required | **Note:** Hiện tại chưa implement trong code<br>Cần thêm field |
| **User ID** | Must exist | - Valid user ID<br>- User must exist in DB<br>- Foreign key constraint | Backend: User lookup via UserService |

### **CREATE Flow Diagram:**

```
┌──────────────────────────────────────────────────────────────────┐
│                    CREATE PRODUCT FLOW                            │
└──────────────────────────────────────────────────────────────────┘

[1] USER ACTION (Frontend - UserPage.jsx)
    │
    ├─→ Click "Add Product" button
    ├─→ Modal opens with empty form
    ├─→ User enters product information:
    │   ├─→ Title: "Laptop Dell"
    │   ├─→ Description: "High performance laptop"
    │   └─→ Quantity: 10
    │
    ▼
[2] FRONTEND VALIDATION (React State)
    │
    ├─→ Check title not empty
    ├─→ Check quantity is number
    ├─→ Client-side format validation
    │
    ├─→ [FAIL] → Display inline error
    │            → Prevent form submission
    │
    └─→ [PASS] → Continue to API call
    │
    ▼
[3] API REQUEST (Axios)
    │
    POST /api/products/{userId}
    Headers: Content-Type: application/json
    URL: http://localhost:8080/api/products/1
    Body: {
      "title": "Laptop Dell",
      "description": "High performance laptop",
      "quantity": 10
    }
    │
    ▼
[4] BACKEND CONTROLLER (ProductController.java)
    │
    ├─→ @PostMapping("/{userId}")
    ├─→ Extract userId from path: @PathVariable Long userId
    ├─→ Extract ProductDTO from body: @RequestBody ProductDTO dto
    │
    ├─→ [A] Validate User Exists
    │    │
    │    ├─→ Call: userService.findById(userId)
    │    │
    │    ├─→ [User NOT found]
    │    │    └─→ Throw: ResourceNotFoundException
    │    │         → HTTP 404: "User not found with id {userId}"
    │    │
    │    └─→ [User found] → Continue to product creation
    │
    ▼
[5] BUSINESS LOGIC (ProductService.java)
    │
    ├─→ createProduct(ProductDTO dto, User user)
    │
    ├─→ [B] Create Product Entity
    │    │
    │    ├─→ Product product = new Product()
    │    ├─→ product.setTitle(dto.getTitle())
    │    ├─→ product.setDescription(dto.getDescription())
    │    ├─→ product.setQuantity(dto.getQuantity())
    │    └─→ product.setUser(user)  // Link to user
    │
    ├─→ [C] Save to Database
    │    │
    │    └─→ productRepository.save(product)
    │         ├─→ Generate ID (auto-increment)
    │         ├─→ Set timestamps (if enabled)
    │         └─→ Return saved product
    │
    ▼
[6] DATABASE OPERATION (MySQL)
    │
    INSERT INTO products 
      (title, description, quantity, user_id)
    VALUES 
      ('Laptop Dell', 'High performance laptop', 10, 1)
    │
    ├─→ [Success] → Product ID generated (e.g., 123)
    │
    └─→ [Error] → SQLException
         ├─→ Unique constraint violation
         ├─→ Foreign key violation
         └─→ Data type mismatch
    │
    ▼
[7] RESPONSE HANDLING
    │
    ├─→ [SUCCESS - 200 OK]
    │    │
    │    └─→ Response Body: {
    │         "id": 123,
    │         "title": "Laptop Dell",
    │         "description": "High performance laptop",
    │         "quantity": 10,
    │         "user": { ... }  // Populated if not @JsonIgnore
    │       }
    │
    └─→ [ERROR]
         ├─→ 404: User not found
         ├─→ 400: Invalid product data
         └─→ 500: Database error
    │
    ▼
[8] FRONTEND UPDATE (UserPage.jsx)
    │
    ├─→ [Success Response]
    │    │
    │    ├─→ Add product to state: setProducts([...products, response.data])
    │    ├─→ Close modal: setShowModal(false)
    │    ├─→ Clear form: setModalData({ id: null, title: "", ... })
    │    ├─→ Product appears in table immediately
    │    └─→ Show success notification (optional)
    │
    └─→ [Error Response]
         │
         ├─→ Display alert: "Failed to save product."
         ├─→ Keep modal open
         └─→ Allow user to retry
```

### **Key Implementation Details:**

**Frontend (UserPage.jsx):**
```javascript
const handleSave = async () => {
    try {
        if (!isEdit) {
            // CREATE operation
            const response = await axios.post(
                `http://localhost:8080/api/products/${id}`,
                modalData  // {title, description, quantity}
            );
            setProducts([...products, response.data]);
        }
        setShowModal(false);
    } catch (error) {
        console.error("Error saving product:", error);
        alert("Failed to save product.");
    }
};
```

**Backend Controller (ProductController.java):**
```java
@PostMapping("/{userId}")
public ResponseEntity<Product> createProduct(
    @PathVariable Long userId, 
    @RequestBody ProductDTO dto
) {
    User user = userService.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException(
            "User not found with id " + userId
        ));
    Product product = productService.createProduct(dto, user);
    return ResponseEntity.ok(product);
}
```

**Backend Service (ProductService.java):**
```java
public Product createProduct(ProductDTO dto, User user) {
    Product product = new Product();
    product.setTitle(dto.getTitle());
    product.setDescription(dto.getDescription());
    product.setQuantity(dto.getQuantity());
    product.setUser(user);
    return productRepository.save(product);
}
```

### **Error Scenarios - CREATE:**

| **Error Type** | **Condition** | **HTTP Status** | **Error Message** |
|---------------|---------------|-----------------|-------------------|
| User Not Found | userId không tồn tại | 404 Not Found | "User not found with id {userId}" |
| Invalid Data | Title rỗng, quantity âm | 400 Bad Request | Validation error details |
| Database Error | Connection fail, constraint | 500 Internal Error | "Database operation failed" |
| Network Error | Server unreachable | N/A (Client) | "Failed to save product." |

---

## 2. READ - XEM DANH SÁCH/CHI TIẾT SẢN PHẨM

### **Functional Requirements:**

| **Aspect** | **Requirement** | **Details** |
|------------|----------------|-------------|
| **Endpoint** | `GET /api/products/{userId}` | Lấy tất cả products của user |
| **Authentication** | Required | User phải đã đăng nhập |
| **Authorization** | User-specific | Chỉ xem products của chính mình |
| **Response** | Array of Products | Danh sách products hoặc empty array |
| **Sorting** | Not implemented | Có thể thêm sorting by name/date |
| **Pagination** | Not implemented | Load tất cả products (cần optimize) |

### **READ Flow Diagram:**

```
┌──────────────────────────────────────────────────────────────────┐
│                    READ PRODUCTS FLOW                             │
└──────────────────────────────────────────────────────────────────┘

[1] PAGE LOAD (Frontend - UserPage.jsx)
    │
    ├─→ useEffect() triggered on component mount
    ├─→ Extract userId from URL params: const { id } = useParams()
    ├─→ Check if userId exists
    │
    ▼
[2] API REQUEST (Axios GET)
    │
    GET /api/products/{userId}
    URL: http://localhost:8080/api/products/1
    Headers: Content-Type: application/json
    No Body (GET request)
    │
    ▼
[3] BACKEND CONTROLLER (ProductController.java)
    │
    ├─→ @GetMapping("/{userId}")
    ├─→ Extract userId: @PathVariable Long userId
    │
    ├─→ [A] Validate User Exists
    │    │
    │    ├─→ userService.findById(userId)
    │    │
    │    ├─→ [User NOT found]
    │    │    └─→ Throw ResourceNotFoundException
    │    │         → HTTP 404: "User not found with id {userId}"
    │    │
    │    └─→ [User found] → Continue to fetch products
    │
    ▼
[4] BUSINESS LOGIC (ProductService.java)
    │
    ├─→ getProductsByUser(User user)
    ├─→ Call repository: productRepository.findByUser(user)
    │
    ▼
[5] DATABASE QUERY (MySQL)
    │
    SELECT * FROM products 
    WHERE user_id = 1
    ORDER BY id ASC  // Default ordering
    │
    ├─→ [Found Products] → Return list (1 or more)
    │
    └─→ [No Products] → Return empty list []
    │
    ▼
[6] RESPONSE HANDLING
    │
    ├─→ [SUCCESS - 200 OK]
    │    │
    │    └─→ Response Body: [
    │         {
    │           "id": 1,
    │           "title": "Laptop Dell",
    │           "description": "High performance",
    │           "quantity": 10
    │         },
    │         {
    │           "id": 2,
    │           "title": "Mouse Logitech",
    │           "description": "Wireless mouse",
    │           "quantity": 50
    │         }
    │       ]
    │
    └─→ [ERROR]
         ├─→ 404: User not found
         └─→ 500: Database error
    │
    ▼
[7] FRONTEND DISPLAY (UserPage.jsx)
    │
    ├─→ [Success Response]
    │    │
    │    ├─→ Store in state: setProducts(response.data)
    │    ├─→ Render table with products
    │    ├─→ Show Edit/Delete buttons per row
    │    └─→ Display product count
    │
    ├─→ [Empty Array]
    │    │
    │    └─→ Display: "No items yet."
    │
    └─→ [Error Response]
         │
         └─→ console.error("Error fetching products")
              Display error message to user
```

### **Implementation Details:**

**Frontend (UserPage.jsx):**
```javascript
useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/products/${id}`
            );
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    if (id) fetchProducts();
}, [id]);  // Re-fetch when userId changes
```

**Table Rendering:**
```javascript
{products.length > 0 ? (
    products.map(p => (
        <tr key={p.id}>
            <td>{p.title}</td>
            <td>{p.description}</td>
            <td>{p.quantity}</td>
            <td>
                <button onClick={() => openEditModal(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
            </td>
        </tr>
    ))
) : (
    <tr>
        <td colSpan="4">No items yet.</td>
    </tr>
)}
```

**Backend Controller (ProductController.java):**
```java
@GetMapping("/{userId}")
public ResponseEntity<List<Product>> getProducts(@PathVariable Long userId) {
    User user = userService.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException(
            "User not found with id " + userId
        ));
    List<Product> products = productService.getProductsByUser(user);
    return ResponseEntity.ok(products);
}
```

**Backend Service (ProductService.java):**
```java
public List<Product> getProductsByUser(User user) {
    return productRepository.findByUser(user);
}
```

### **Read Characteristics:**

| **Characteristic** | **Current Implementation** | **Recommendation** |
|-------------------|---------------------------|-------------------|
| **Filtering** | None | Add search by title/description |
| **Sorting** | Default (by ID) | Add sort by name, quantity, date |
| **Pagination** | None (load all) | Implement pagination for large datasets |
| **Caching** | None | Add client-side caching |
| **Performance** | N+1 query risk | Use JOIN FETCH if loading user data |

---

## 3. UPDATE - CẬP NHẬT THÔNG TIN SẢN PHẨM

### **Functional Requirements:**

| **Aspect** | **Requirement** | **Details** |
|------------|----------------|-------------|
| **Endpoint** | `PUT /api/products/{productId}` | Update product by ID |
| **Authentication** | Required | User phải đã đăng nhập |
| **Authorization** | **Missing!** | Cần check product thuộc về user |
| **Input Fields** | title, description, quantity | Partial update supported |
| **Response** | Updated Product | Trả về product sau khi update |
| **Validation** | Same as CREATE | All validation rules apply |

### **UPDATE Flow Diagram:**

```
┌──────────────────────────────────────────────────────────────────┐
│                    UPDATE PRODUCT FLOW                            │
└──────────────────────────────────────────────────────────────────┘

[1] USER ACTION (Frontend - UserPage.jsx)
    │
    ├─→ Click "Edit" button on product row
    ├─→ openEditModal(product) called
    ├─→ Modal opens with pre-filled data:
    │   ├─→ modalData = {id: 1, title: "Laptop Dell", ...}
    │   └─→ isEdit = true
    │
    ├─→ User modifies fields (e.g., change quantity from 10 to 15)
    ├─→ Click "Save" button
    │
    ▼
[2] FRONTEND VALIDATION
    │
    ├─→ Check title not empty
    ├─→ Check quantity valid
    │
    └─→ [PASS] → Continue to API call
    │
    ▼
[3] API REQUEST (Axios PUT)
    │
    PUT /api/products/{productId}
    URL: http://localhost:8080/api/products/1
    Headers: Content-Type: application/json
    Body: {
      "title": "Laptop Dell XPS",      // Updated
      "description": "High performance",
      "quantity": 15                     // Updated from 10
    }
    │
    ▼
[4] BACKEND CONTROLLER (ProductController.java)
    │
    ├─→ @PutMapping("/{productId}")
    ├─→ Extract productId: @PathVariable Long productId
    ├─→ Extract ProductDTO: @RequestBody ProductDTO dto
    │
    ├─→ Call: productService.updateProduct(productId, dto)
    │
    ▼
[5] BUSINESS LOGIC (ProductService.java)
    │
    ├─→ updateProduct(Long id, ProductDTO dto)
    │
    ├─→ [A] Find Existing Product
    │    │
    │    ├─→ productRepository.findById(id)
    │    │
    │    ├─→ [Product NOT found]
    │    │    └─→ Throw ResourceNotFoundException
    │    │         → HTTP 404: "Product not found"
    │    │
    │    └─→ [Product found] → Continue update
    │
    ├─→ [B] Update Fields
    │    │
    │    ├─→ product.setTitle(dto.getTitle())
    │    ├─→ product.setDescription(dto.getDescription())
    │    └─→ product.setQuantity(dto.getQuantity())
    │
    ├─→ [C] Save Changes
    │    │
    │    └─→ productRepository.save(product)
    │         └─→ JPA detects changes and UPDATE query
    │
    ▼
[6] DATABASE OPERATION (MySQL)
    │
    UPDATE products 
    SET 
      title = 'Laptop Dell XPS',
      description = 'High performance',
      quantity = 15
    WHERE id = 1
    │
    └─→ Return updated product entity
    │
    ▼
[7] RESPONSE HANDLING
    │
    ├─→ [SUCCESS - 200 OK]
    │    │
    │    └─→ Response Body: {
    │         "id": 1,
    │         "title": "Laptop Dell XPS",
    │         "description": "High performance",
    │         "quantity": 15
    │       }
    │
    └─→ [ERROR]
         ├─→ 404: Product not found
         └─→ 400: Invalid data
    │
    ▼
[8] FRONTEND UPDATE (UserPage.jsx)
    │
    ├─→ [Success Response]
    │    │
    │    ├─→ Update state:
    │    │    setProducts(products.map(p => 
    │    │        p.id === modalData.id ? response.data : p
    │    │    ))
    │    │
    │    ├─→ Close modal: setShowModal(false)
    │    └─→ Table re-renders with updated data
    │
    └─→ [Error Response]
         └─→ alert("Failed to save product.")
```

### **Implementation Code:**

**Frontend (UserPage.jsx):**
```javascript
const openEditModal = (product) => {
    setIsEdit(true);
    setModalData(product);  // Pre-fill with existing data
    setShowModal(true);
};

const handleSave = async () => {
    try {
        if (isEdit) {
            // UPDATE operation
            const response = await axios.put(
                `http://localhost:8080/api/products/${modalData.id}`,
                modalData
            );
            // Replace updated product in state
            setProducts(products.map(p => 
                p.id === modalData.id ? response.data : p
            ));
        }
        setShowModal(false);
    } catch (error) {
        alert("Failed to save product.");
    }
};
```

**Backend Controller (ProductController.java):**
```java
@PutMapping("/{productId}")
public ResponseEntity<Product> updateProduct(
    @PathVariable Long productId, 
    @RequestBody ProductDTO dto
) {
    Product updatedProduct = productService.updateProduct(productId, dto);
    return ResponseEntity.ok(updatedProduct);
}
```

**Backend Service (ProductService.java):**
```java
public Product updateProduct(Long id, ProductDTO dto) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    
    // Update fields
    product.setTitle(dto.getTitle());
    product.setDescription(dto.getDescription());
    product.setQuantity(dto.getQuantity());
    
    return productRepository.save(product);
}
```

### **⚠️ SECURITY ISSUE - UPDATE:**

**Problem:** Không kiểm tra product có thuộc về user hiện tại không!

```java
// CURRENT CODE - INSECURE:
public Product updateProduct(Long id, ProductDTO dto) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    // ❌ Any authenticated user can update ANY product!
    ...
}

// RECOMMENDED FIX:
public Product updateProduct(Long id, Long userId, ProductDTO dto) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    
    // ✅ Check ownership
    if (!product.getUser().getId().equals(userId)) {
        throw new UnauthorizedException("Cannot update product of another user");
    }
    
    product.setTitle(dto.getTitle());
    ...
}
```

---

## 4. DELETE - XÓA SẢN PHẨM

### **Functional Requirements:**

| **Aspect** | **Requirement** | **Details** |
|------------|----------------|-------------|
| **Endpoint** | `DELETE /api/products/{productId}` | Delete product by ID |
| **Authentication** | Required | User phải đã đăng nhập |
| **Authorization** | **Missing!** | Cần check product thuộc về user |
| **Confirmation** | Client-side | JavaScript confirm dialog |
| **Response** | Success message | String: "Product deleted successfully" |
| **Cascade** | None | Xóa product không ảnh hưởng user |

### **DELETE Flow Diagram:**

```
┌──────────────────────────────────────────────────────────────────┐
│                    DELETE PRODUCT FLOW                            │
└──────────────────────────────────────────────────────────────────┘

[1] USER ACTION (Frontend - UserPage.jsx)
    │
    ├─→ Click "Delete" button on product row
    ├─→ Confirmation dialog: "Are you sure?"
    │
    ├─→ [User clicks Cancel] → Abort, no action
    │
    └─→ [User clicks OK] → Continue to delete
    │
    ▼
[2] API REQUEST (Axios DELETE)
    │
    DELETE /api/products/{productId}
    URL: http://localhost:8080/api/products/1
    Headers: Content-Type: application/json
    No Body (DELETE request)
    │
    ▼
[3] BACKEND CONTROLLER (ProductController.java)
    │
    ├─→ @DeleteMapping("/{productId}")
    ├─→ Extract productId: @PathVariable Long productId
    │
    ├─→ Call: productService.deleteProduct(productId)
    │
    ▼
[4] BUSINESS LOGIC (ProductService.java)
    │
    ├─→ deleteProduct(Long id)
    │
    ├─→ [A] Check Product Exists
    │    │
    │    ├─→ productRepository.existsById(id)
    │    │
    │    ├─→ [Product NOT exists]
    │    │    └─→ Throw ResourceNotFoundException
    │    │         → HTTP 404: "Product not found"
    │    │
    │    └─→ [Product exists] → Continue delete
    │
    ├─→ [B] Delete Product
    │    │
    │    └─→ productRepository.deleteById(id)
    │
    ▼
[5] DATABASE OPERATION (MySQL)
    │
    DELETE FROM products WHERE id = 1
    │
    ├─→ [Success] → 1 row affected
    │
    └─→ [Error] → Foreign key constraint (if exists)
    │
    ▼
[6] RESPONSE HANDLING
    │
    ├─→ [SUCCESS - 200 OK]
    │    │
    │    └─→ Response Body: "Product deleted successfully"
    │
    └─→ [ERROR]
         ├─→ 404: Product not found
         └─→ 500: Database error
    │
    ▼
[7] FRONTEND UPDATE (UserPage.jsx)
    │
    ├─→ [Success Response]
    │    │
    │    ├─→ Remove from state:
    │    │    setProducts(products.filter(p => p.id !== productId))
    │    │
    │    ├─→ Table re-renders without deleted product
    │    └─→ Row disappears immediately
    │
    └─→ [Error Response]
         │
         └─→ alert("Failed to delete product.")
              Product remains in list
```

### **Implementation Code:**

**Frontend (UserPage.jsx):**
```javascript
const handleDelete = async (productId) => {
    // Confirmation dialog
    if (!window.confirm("Are you sure?")) return;
    
    try {
        await axios.delete(`http://localhost:8080/api/products/${productId}`);
        
        // Remove from state - optimistic update
        setProducts(products.filter(p => p.id !== productId));
        
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
    }
};
```

**Backend Controller (ProductController.java):**
```java
@DeleteMapping("/{productId}")
public ResponseEntity<String> deleteProduct(@PathVariable Long productId) {
    productService.deleteProduct(productId);
    return ResponseEntity.ok("Product deleted successfully");
}
```

**Backend Service (ProductService.java):**
```java
public void deleteProduct(Long id) {
    if (!productRepository.existsById(id)) {
        throw new ResourceNotFoundException("Product not found");
    }
    productRepository.deleteById(id);
}
```

### **⚠️ SECURITY ISSUE - DELETE:**

**Same as UPDATE:** Không kiểm tra ownership!

```java
// RECOMMENDED FIX:
public void deleteProduct(Long id, Long userId) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    
    // ✅ Check ownership
    if (!product.getUser().getId().equals(userId)) {
        throw new UnauthorizedException("Cannot delete product of another user");
    }
    
    productRepository.deleteById(id);
}
```

### **Delete Considerations:**

| **Aspect** | **Current** | **Consideration** |
|-----------|------------|-------------------|
| **Soft Delete** | No (hard delete) | Consider adding `deleted_at` timestamp |
| **Audit Trail** | No | Log who deleted what and when |
| **Undo** | No | Allow restore within timeframe |
| **Cascade** | N/A | No related entities to cascade |
| **Confirmation** | Client-side only | Consider server-side token |

---

## VALIDATION RULES SUMMARY (TẤT CẢ OPERATIONS)

### **Complete Validation Matrix:**

| **Field** | **Min** | **Max** | **Type** | **Required** | **Special Rules** |
|-----------|---------|---------|----------|--------------|-------------------|
| **Title** | 3 chars | 100 chars | String | Yes | Trim spaces, no empty |
| **Description** | 0 chars | 500 chars | String | No | Optional field |
| **Quantity** | 0 | 99,999 | Integer | Yes | Non-negative, 0 = out of stock |
| **Price** | > 0 | 999,999,999 | Decimal | Yes | **Not implemented yet** |
| **Category** | N/A | N/A | Enum/String | Yes | **Not implemented yet** |
| **User ID** | N/A | N/A | Long | Yes | Must exist in users table |

### **⚠️ MISSING IMPLEMENTATIONS:**

1. **Price field:** Không có trong entity và DTO
2. **Category field:** Không có trong entity và DTO
3. **Ownership validation:** UPDATE và DELETE không check user
4. **Business rules:** Không validate trùng tên, etc.

---

**END OF PART 1**

**Next:** Part 2 sẽ có Test Scenarios và Priority Classification
