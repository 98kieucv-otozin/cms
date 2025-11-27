# HTTP-Only Cookies Implementation

## Cách hoạt động

Dự án này sử dụng **HTTP-Only Cookies** để bảo mật authentication. Đây là cách đúng để sử dụng HTTP-Only cookies:

### Đặc điểm của HTTP-Only Cookies:

1. **Được set từ Server**: Cookie được server set trong HTTP response header (`Set-Cookie`)
2. **Không thể truy cập từ JavaScript**: `document.cookie` không thể đọc/ghi HTTP-Only cookies
3. **Tự động gửi kèm requests**: Browser tự động gửi cookie trong mọi request đến cùng domain
4. **Bảo mật hơn**: Ngăn chặn XSS attacks vì JavaScript không thể truy cập cookie

### Flow hoạt động:

#### 1. Login
```
Frontend → POST /api/auth/login (username, password)
Backend → Validate credentials → Set HTTP-Only cookie trong response header
         Set-Cookie: authToken=xxx; HttpOnly; Secure; SameSite=Lax
Frontend → Cookie được browser tự động lưu (không thể đọc từ JS)
```

#### 2. Check Authentication
```
Frontend → GET /api/auth/status (cookie tự động gửi kèm)
Backend → Đọc cookie từ request → Validate → Return { isAuthenticated: true, username: "..." }
Frontend → Update state dựa trên response
```

#### 3. Logout
```
Frontend → POST /api/auth/logout (cookie tự động gửi kèm)
Backend → Xóa cookie: Set-Cookie: authToken=; expires=Thu, 01 Jan 1970...
Frontend → Clear local state
```

## Backend Requirements

Backend cần implement các endpoints sau:

### POST /api/auth/login
- Nhận: `{ username: string, password: string }`
- Validate credentials
- Set HTTP-Only cookie trong response:
  ```
  Set-Cookie: authToken=<token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800
  ```
- Return: `{ success: true, user: { username: string } }`

### GET /api/auth/status
- Đọc HTTP-Only cookie từ request
- Validate token
- Return: `{ isAuthenticated: true, username: string }` hoặc `{ isAuthenticated: false }`

### POST /api/auth/logout
- Xóa HTTP-Only cookie:
  ```
  Set-Cookie: authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/
  ```
- Return: `{ success: true }`

## CORS Configuration

Backend cần cấu hình CORS để cho phép credentials:

```javascript
// Express example
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Important: allow cookies
}));
```

## Environment Variables

Tạo file `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

## Lưu ý

- Tất cả API calls phải có `credentials: "include"` để gửi cookies
- Backend phải set cookie với flag `HttpOnly`
- Cookie sẽ tự động được gửi kèm trong mọi request đến cùng domain
- Frontend không thể đọc/ghi cookie từ JavaScript (đây là tính năng bảo mật)

