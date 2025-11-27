# BẢNG THUẬT NGỮ VIỆT HÓA - ĐỀ XUẤT

## CÁC THUẬT NGỮ NÊN VIỆT HÓA

| Tiếng Anh (Hiện tại) | Tiếng Việt (Đề xuất) | Ghi chú |
|----------------------|----------------------|---------|
| **Test Case** | **Ca kiểm thử** | Thuật ngữ phổ biến trong testing |
| **Test Scenario** | **Kịch bản kiểm thử** | Dùng khi mô tả tình huống |
| **Test Data** | **Dữ liệu kiểm thử** | |
| **Expected Result** | **Kết quả mong đợi** | |
| **Actual Result** | **Kết quả thực tế** | |
| **Precondition** | **Điều kiện tiên quyết** | |
| **Postcondition** | **Điều kiện sau kiểm thử** | |
| **Test Steps** | **Các bước thực hiện** | |
| **Priority** | **Mức độ ưu tiên** | |
| **Status** | **Trạng thái** | |
| **Happy Path** | **Luồng chính** hoặc **Kịch bản thành công** | |
| **Negative Test** | **Kiểm thử tiêu cực** hoặc **Kịch bản lỗi** | |
| **Edge Case** | **Trường hợp biên** | |
| **Boundary Test** | **Kiểm thử biên** | |
| **Validation** | **Kiểm tra hợp lệ** hoặc giữ **Validation** | |
| **Authentication** | **Xác thực** | |
| **Authorization** | **Phân quyền** | |
| **Error Handling** | **Xử lý lỗi** | |
| **Error Message** | **Thông báo lỗi** | |
| **Required Field** | **Trường bắt buộc** | |
| **Optional Field** | **Trường tùy chọn** | |

## CÁC THUẬT NGỮ KỸ THUẬT NÊN GIỮ TIẾNG ANH

| Thuật ngữ | Lý do giữ tiếng Anh |
|-----------|---------------------|
| **Login / Logout** | Thuật ngữ phổ biến, dễ hiểu |
| **Email / Password** | Thuật ngữ quốc tế, không nên dịch |
| **Username** | Có thể để hoặc dịch "Tên đăng nhập" |
| **CRUD** (Create/Read/Update/Delete) | Thuật ngữ kỹ thuật chuẩn |
| **API / REST API** | Thuật ngữ lập trình chuẩn |
| **Frontend / Backend** | Thuật ngữ kỹ thuật |
| **Database / DB** | Có thể dịch "Cơ sở dữ liệu" |
| **Source Code** | Có thể dịch "Mã nguồn" |
| **BCrypt / Hash** | Thuật ngữ mã hóa chuẩn |
| **JWT Token** | Thuật ngữ kỹ thuật |
| **HTTP Status Code** | Mã trạng thái HTTP (giữ số) |
| **GET / POST / PUT / DELETE** | HTTP methods chuẩn |
| **Response / Request** | Có thể dịch "Phản hồi / Yêu cầu" |
| **Session / Cookie** | Thuật ngữ web chuẩn |
| **Framework** | Có thể dịch "Khung làm việc" nhưng thường giữ |
| **Component** | Có thể dịch "Thành phần" |
| **Repository** | Giữ hoặc dịch "Kho dữ liệu" |
| **Controller / Service** | Thuật ngữ kiến trúc MVC |
| **DTO (Data Transfer Object)** | Thuật ngữ pattern chuẩn |

## ĐỀ XUẤT CẤU TRÚC TIÊU ĐỀ

### Hiện tại:
```
TEST SCENARIOS
Test Case ID: TC_LOGIN_001
Priority: Critical
Expected Result: ...
```

### Sau khi Việt hóa:
```
KỊCH BẢN KIỂM THỬ
Mã ca kiểm thử: TC_LOGIN_001
Mức độ ưu tiên: Nghiêm trọng
Kết quả mong đợi: ...
```

## ĐỀ XUẤT CỤ THỂ CHO TÀI LIỆU

Tôi khuyến nghị **GIỮ MỘT SỐ THUẬT NGỮ TIẾNG ANH** trong các trường hợp sau:

1. **Tên file code**: `LoginPage.jsx`, `UserController.java` - GIỮ NGUYÊN
2. **Tên API endpoint**: `POST /api/users/login` - GIỮ NGUYÊN  
3. **Mã lỗi HTTP**: `401 Unauthorized`, `200 OK` - GIỮ NGUYÊN
4. **Tên công nghệ**: React, Spring Boot, MySQL - GIỮ NGUYÊN
5. **Thuật ngữ kỹ thuật**: CRUD, API, BCrypt, JWT - GIỮ NGUYÊN

Nhưng **VIỆT HÓA** các phần:
- Tiêu đề bảng
- Mô tả chức năng
- Các bước thực hiện
- Kết quả mong đợi
- Ghi chú và nhận xét

**Ví dụ cải thiện:**

❌ **Trước:**
```
Test Case ID: TC_LOGIN_001
Test Scenario: Valid Login
Priority: Critical
Preconditions: User account exists in database
```

✅ **Sau:**
```
Mã ca kiểm thử: TC_LOGIN_001
Kịch bản: Đăng nhập hợp lệ (Valid Login)
Mức độ ưu tiên: Nghiêm trọng (Critical)
Điều kiện tiên quyết: Tài khoản người dùng đã tồn tại trong database
```

---

**Bạn có muốn tôi tạo lại các file markdown với phong cách Việt hóa như trên không?**
