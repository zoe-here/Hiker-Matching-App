import React from "react";
import { Modal, Form, Button, Input } from "antd";

function EditNameModal({ 
  visible, 
  onCancel, 
  onSubmit, 
  firstName, 
  setFirstName, 
  lastName, 
  setLastName, 
  nameError, 
  loading 
}) {
  return (
    <Modal
      title="Edit Name"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="First Name"
          validateStatus={nameError.firstName ? "error" : ""}
          help={nameError.firstName || ""}
        >
          <Input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Enter your first name"
          />
        </Form.Item>
        
        <Form.Item
          label="Last Name"
          validateStatus={nameError.lastName ? "error" : ""}
          help={nameError.lastName || ""}
        >
          <Input
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Enter your last name"
          />
        </Form.Item>
        
        {nameError.general && (
          <div style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>
            {nameError.general}
          </div>
        )}
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditNameModal;
