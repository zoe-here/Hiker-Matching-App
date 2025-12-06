import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./schemas/registerSchema";
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  DatePicker,
  message as antdMessage,
  Card,
  Typography,
} from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import { useEnums } from "./EnumsContext";
import { Link } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

function RegisterPage() {
  const { enums, loading: enumsLoading } = useEnums();
  const [loading, setLoading] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      birthDate: "",
      gender: "",
      ownExperienceLevel: "",
      ownPace: "",
      ownRegion: "",
      ownLanguages: [],
      ownHikeTypes: [],
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setEmailExistsError("");
    setSuccessMessage("");
    try {
      const response = await fetch("/v1/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSuccessMessage("Registration successful!");
      } else if (response.status === 409) {
        const err = await response.json();
        setEmailExistsError(err.message || "Email already exists");
      } else {
        const err = await response.json();
        antdMessage.error(
          "Registration failed: " + (err.message || "Unknown error")
        );
      }
    } catch (error) {
      antdMessage.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (enumsLoading) {
    return <div>Loading form options...</div>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
      {/* Welcome Banner */}
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
          Join Winder
        </Title>
        <Typography.Paragraph style={{ color: "white", opacity: 0.9, fontSize: "1.2rem", margin: 0 }}>
          Create your account and start connecting with hiking partners
        </Typography.Paragraph>
      </Card>

      {/* Original Register Form */}
      <div style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
      }}>
        <h2>Register</h2>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="First Name"
            validateStatus={errors.firstName ? "error" : ""}
            help={errors.firstName?.message}
          >
            <Input
              value={watch("firstName")}
              onChange={(e) => setValue("firstName", e.target.value)}
              placeholder="First Name"
            />
          </Form.Item>
          <Form.Item
            label="Last Name"
            validateStatus={errors.lastName ? "error" : ""}
            help={errors.lastName?.message}
          >
            <Input
              value={watch("lastName")}
              onChange={(e) => setValue("lastName", e.target.value)}
              placeholder="Last Name"
            />
          </Form.Item>
          <Form.Item
            label="Email"
            validateStatus={errors.email || emailExistsError ? "error" : ""}
            help={errors.email?.message || emailExistsError}
          >
            <Input
              value={watch("email")}
              onChange={(e) => setValue("email", e.target.value)}
              placeholder="Email"
              type="email"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Input.Password
              value={watch("password")}
              onChange={(e) => setValue("password", e.target.value)}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            label="Birth Date"
            validateStatus={errors.birthDate ? "error" : ""}
            help={errors.birthDate?.message}
          >
            <DatePicker
              style={{ width: "100%" }}
              value={watch("birthDate") ? dayjs(watch("birthDate")) : null}
              onChange={(date, dateString) => setValue("birthDate", dateString)}
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            label="Gender"
            validateStatus={errors.gender ? "error" : ""}
            help={errors.gender?.message}
          >
            <Select
              value={watch("gender")}
              onChange={(val) => setValue("gender", val)}
              placeholder="Select Gender"
            >
              {enums.genderOptions.map((opt) => (
                <Option key={opt.name} value={opt.name}>
                  {opt.displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Your experience level"
            validateStatus={errors.ownExperienceLevel ? "error" : ""}
            help={errors.ownExperienceLevel?.message}
          >
            <Select
              value={watch("ownExperienceLevel")}
              onChange={(val) => setValue("ownExperienceLevel", val)}
              placeholder="Select Experience"
            >
              {enums.experienceLevels.map((opt) => (
                <Option key={opt.name} value={opt.name}>
                  {opt.displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Your hiking pace"
            validateStatus={errors.ownPace ? "error" : ""}
            help={errors.ownPace?.message}
          >
            <Select
              value={watch("ownPace")}
              onChange={(val) => setValue("ownPace", val)}
              placeholder="Select Pace"
            >
              {enums.paceOptions.map((opt) => (
                <Option key={opt.name} value={opt.name}>
                  {opt.displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Region you are located in"
            validateStatus={errors.ownRegion ? "error" : ""}
            help={errors.ownRegion?.message}
          >
            <Select
              value={watch("ownRegion")}
              onChange={(val) => setValue("ownRegion", val)}
              placeholder="Select Region"
            >
              {enums.regionOptions.map((opt) => (
                <Option key={opt.name} value={opt.name}>
                  {opt.displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Languages you speak"
            validateStatus={errors.ownLanguages ? "error" : ""}
            help={errors.ownLanguages?.message}
          >
            <Checkbox.Group
              options={enums.languageOptions.map((opt) => ({
                label: opt.displayName,
                value: opt.name,
              }))}
              value={watch("ownLanguages")}
              onChange={(vals) => setValue("ownLanguages", vals)}
            />
          </Form.Item>
          <Form.Item
            label="Hike Types"
            validateStatus={errors.ownHikeTypes ? "error" : ""}
            help={errors.ownHikeTypes?.message}
          >
            <Checkbox.Group
              options={
                Array.isArray(enums.hikeTypeOptions)
                  ? enums.hikeTypeOptions.map((opt) => ({
                      label: opt.displayName,
                      value: opt.name,
                    }))
                  : []
              }
              value={watch("ownHikeTypes")}
              onChange={(vals) => setValue("ownHikeTypes", vals)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{
                  backgroundColor: "#667eea",
                  borderColor: "#667eea"
                }}>
              Register
            </Button>
          </Form.Item>
        </Form>
        {successMessage && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ color: 'green', marginBottom: '16px', fontSize: '16px' }}>
              {successMessage}
            </div>
            <Link to="/login">
              <Button 
                type="primary" 
                size="large"
                style={{
                  backgroundColor: "#667eea",
                  borderColor: "#667eea"
                }}
              >
                Proceed to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;

//TODO:  Make/check the page responsive for different screen sizes