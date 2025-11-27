import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PRIMARY_COLOR, PRIMARY_COLOR_LIGHT } from "../constants/colors";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { fullName, email } = values;
    setLoading(true);
    try {
      // TODO: integrate real register API
      await new Promise((resolve) => setTimeout(resolve, 800));
      message.success(
        `Đăng ký thành công cho ${fullName || email}! Vui lòng đăng nhập.`
      );
      navigate("/login");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Đăng ký thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const sharedInputStyle = {
    height: "40px",
    fontSize: "14px",
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: "2px",
  } as const;

  const handleFocus = (target: HTMLInputElement) => {
    target.style.borderColor = PRIMARY_COLOR;
    target.style.boxShadow = `0 0 0 2px ${PRIMARY_COLOR_LIGHT}`;
  };

  const handleBlur = (target: HTMLInputElement) => {
    target.style.borderColor = "rgba(0,0,0,0.14)";
    target.style.boxShadow = "none";
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
            Đăng ký
          </h1>
        </div>

        <Form
          name="register"
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
        >
          <Form.Item
            name="fullName"
            style={{ marginBottom: "20px" }}
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input
              placeholder="Họ và tên"
              size="large"
              style={sharedInputStyle}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={(e) => handleBlur(e.target)}
            />
          </Form.Item>

          <Form.Item
            name="email"
            style={{ marginBottom: "20px" }}
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              placeholder="Email"
              size="large"
              style={sharedInputStyle}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={(e) => handleBlur(e.target)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            style={{ marginBottom: "20px" }}
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              size="large"
              style={sharedInputStyle}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={(e) => handleBlur(e.target)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            style={{ marginBottom: "10px" }}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu"
              size="large"
              style={sharedInputStyle}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={(e) => handleBlur(e.target)}
            />
          </Form.Item>

          <div
            style={{
              fontSize: "12px",
              color: "rgba(0,0,0,0.6)",
              marginBottom: "20px",
            }}
          >
            Bằng việc đăng ký, bạn đồng ý với{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                message.info("Điều khoản sử dụng đang được cập nhật");
              }}
              style={{ color: PRIMARY_COLOR, textDecoration: "none" }}
            >
              Điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                message.info("Chính sách bảo mật đang được cập nhật");
              }}
              style={{ color: PRIMARY_COLOR, textDecoration: "none" }}
            >
              Chính sách bảo mật
            </a>
            .
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
              ĐĂNG KÝ
            </Button>
          </Form.Item>
        </Form>

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
          Đã có tài khoản?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            style={{
              color: PRIMARY_COLOR,
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}

