import React from "react";
import { Modal, Form, Button, Input, DatePicker, Select } from "antd";

function EditAboutModal({ 
  visible, 
  onCancel, 
  onSubmit, 
  aboutMeValue, 
  setAboutMeValue, 
  birthDateValue, 
  onBirthDateChange, 
  birthDateError, 
  genderValue, 
  setGenderValue, 
  enums, 
  loading 
}) {
  return (
    <Modal
      title="Edit About Me & Contact"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item label="About Me">
          <Input.TextArea
            value={aboutMeValue}
            onChange={e => setAboutMeValue(e.target.value)}
            placeholder="Tell us about yourself"
          />
        </Form.Item>
        
        <Form.Item 
          label="Birth Date" 
          validateStatus={birthDateError ? "error" : ""} 
          help={birthDateError}
        >
          <DatePicker
            value={birthDateValue}
            onChange={onBirthDateChange}
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            allowClear
          />
        </Form.Item>
        
        <Form.Item label="Gender">
          <Select
            value={genderValue}
            onChange={val => setGenderValue(val)}
            placeholder="Select Gender"
          >
            {enums.genderOptions.map(opt => (
              <Select.Option key={opt.name} value={opt.name}>
                {opt.displayName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditAboutModal;
