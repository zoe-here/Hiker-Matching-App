import React from "react";
import { Modal, Form, Button, Input } from "antd";

function ChangeEmailModal({ 
  visible, 
  onCancel, 
  onSubmit, 
  currentEmail, 
  newEmail, 
  setNewEmail, 
  emailPassword, 
  setEmailPassword, 
  emailError 
}) {
  return (
    <Modal
      title="Change Email"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Current Email">
          <Input value={currentEmail || ""} disabled />
        </Form.Item>
        
        <Form.Item
          label="New Email"
          validateStatus={emailError.newEmail ? "error" : ""}
          help={emailError.newEmail || ""}
        >
          <Input
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="Enter new email address"
            type="email"
          />
        </Form.Item>
        
        <Form.Item
          label="Existing Password For Confirmation"
          validateStatus={emailError.password ? "error" : ""}
          help={emailError.password || ""}
        >
          <Input.Password
            value={emailPassword}
            onChange={e => setEmailPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </Form.Item>
        
        {emailError.general && (
          <div style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>
            {emailError.general}
          </div>
        )}
        
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update Email
          </Button>
        </Form.Item>
        
        <div style={{ color: '#555', marginTop: 8, textAlign: 'center', fontSize: 13 }}>
          Upon successful update of email, you will be logged out. You should then log back in with your new email address.
        </div>
      </Form>
    </Modal>
  );
}

export default ChangeEmailModal;
