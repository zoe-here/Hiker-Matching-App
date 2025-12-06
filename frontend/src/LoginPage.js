import React, { useState } from "react";
import { Form, Input, Button, message, Card, Typography, Divider } from "antd";
import { useNavigate, Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/v1/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const data = await response.json();
        
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);

        message.success("Login successful!");
        navigate("/dashboard");
      } else {
        const err = await response.json();
        setError(err.message || "Login failed. Please try again.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
      {/* Welcome Section */}
      <Card
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          marginBottom: "32px",
          border: "none"
        }}
        bodyStyle={{ padding: "40px", textAlign: "center" }}
      >
        <Title 
          level={1} 
          style={{ 
            color: "white", 
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            margin: "0 0 16px 0" 
          }}
        >
          Welcome to Winder
        </Title>
        <Paragraph style={{ color: "white", opacity: 0.9, fontSize: "1.2rem", margin: 0 }}>
          Sign in to continue your hiking adventures
        </Paragraph>
      </Card>

      {/* Login Form */}
      <Card
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}
        bodyStyle={{ padding: "40px" }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "32px" }}>
          Login
        </Title>
        
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
              style={{
                backgroundColor: "#667eea",
                borderColor: "#667eea"
              }}
            >
              Login
            </Button>
          </Form.Item>
          {error && (
            <div style={{ color: "red", textAlign: "center", marginTop: "16px" }}>{error}</div>
          )}
        </Form>
        
        <Divider />
        
        <div style={{ textAlign: "center" }}>
          <Paragraph style={{ color: "#8c8c8c" }}>
            Don't have an account?
          </Paragraph>
          <Link to="/register">
            <Button 
              type="default" 
              size="large" 
              block
              style={{
                borderColor: "#667eea",
                color: "#667eea"
              }}
            >
              Register Now
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
