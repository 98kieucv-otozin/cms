import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PRIMARY_COLOR, PRIMARY_COLOR_LIGHT } from "../constants/colors";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      // TODO: integrate real forgot password API
      await new Promise((resolve) => setTimeout(resolve, 800));
      message.success(
        `Đã gửi hướng dẫn đặt lại mật khẩu đến ${values.email}. Vui lòng kiểm tra hộp thư!`
      );
      navigate("/login");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Gửi yêu cầu thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    height: "40px",
    fontSize: "14px",
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: "2px",
  } as const;

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
            Quên mật khẩu
          </h1>
          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "rgba(0,0,0,0.6)",
              fontSize: "14px",
            }}
          >
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
          </p>
        </div>

        <Form
          name="forgot-password"
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
        >
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
              style={inputStyle}
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
              GỬI HƯỚNG DẪN
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
          Nhớ mật khẩu rồi?{" "}
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

