import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { PRIMARY_COLOR, PRIMARY_COLOR_LIGHT } from "../constants/colors";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      // Call API - server will set HTTP-Only cookie in response
      await login(values.email, values.password);
      message.success("Đăng nhập thành công!");
      navigate("/admin");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "350px",
          background: "#fff",
          borderRadius: "4px",
          padding: "38px 30px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo/Brand */}
        <div style={{ textAlign: "left", marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "500",
              color: PRIMARY_COLOR,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Đăng nhập
          </h1>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
            style={{ marginBottom: "20px" }}
          >
            <Input
              placeholder="Nhập email"
              size="large"
              type="email"
              style={{
                height: "40px",
                fontSize: "14px",
                border: "1px solid rgba(0,0,0,0.14)",
                borderRadius: "2px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = PRIMARY_COLOR;
                e.target.style.boxShadow = `0 0 0 2px ${PRIMARY_COLOR_LIGHT}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(0,0,0,0.14)";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            style={{ marginBottom: "10px" }}
          >
            <Input.Password
              placeholder="Mật khẩu"
              size="large"
              style={{
                height: "40px",
                fontSize: "14px",
                border: "1px solid rgba(0,0,0,0.14)",
                borderRadius: "2px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = PRIMARY_COLOR;
                e.target.style.boxShadow = `0 0 0 2px ${PRIMARY_COLOR_LIGHT}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(0,0,0,0.14)";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Item>

          {/* Forgot password link */}
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
              style={{
                color: PRIMARY_COLOR,
                fontSize: "12px",
                textDecoration: "none",
              }}
            >
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item style={{ marginBottom: "10px" }}>
            <Button
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                height: "40px",
                fontSize: "14px",
                fontWeight: "700",
                background: PRIMARY_COLOR,
                border: "none",
                borderRadius: "2px",
                color: "#fff",
              }}
            >
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px 0",
            color: "rgba(0,0,0,0.26)",
            fontSize: "12px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(0,0,0,0.09)",
            }}
          />
          <span style={{ padding: "0 16px" }}>HOẶC</span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(0,0,0,0.09)",
            }}
          />
        </div>

        {/* Google Login Button */}
        <Button
          block
          size="large"
          onClick={() => {
            message.info("Tính năng đăng nhập bằng Google đang được phát triển");
            // TODO: Implement Google OAuth
            // window.location.href = '/api/auth/google';
          }}
          style={{
            height: "40px",
            fontSize: "14px",
            fontWeight: "500",
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.14)",
            borderRadius: "2px",
            color: "rgba(0,0,0,0.87)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f5f5f5";
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.14)";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            style={{ flexShrink: 0 }}
          >
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.163-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.965-2.184l-2.908-2.258c-.806.54-1.837.86-3.057.86-2.35 0-4.34-1.587-5.053-3.72H.957v2.332C2.438 15.983 5.482 18 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.947 10.698c-.18-.54-.282-1.117-.282-1.698s.102-1.158.282-1.698V4.97H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.03l2.99-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.97L3.947 7.3C4.66 5.163 6.65 3.58 9 3.58z"
            />
          </svg>
          Đăng nhập bằng Google
        </Button>

        {/* Register link */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(0,0,0,0.09)",
            fontSize: "14px",
            color: "rgba(0,0,0,0.87)",
          }}
        >
          Bạn mới biết đến chúng tôi?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
            style={{
              color: PRIMARY_COLOR,
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Đăng ký
          </a>
        </div>
      </div>
    </div>
  );
}

