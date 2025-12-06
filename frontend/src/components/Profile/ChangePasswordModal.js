import React from "react";
import { Modal, Form, Button, Input } from "antd";

function ChangePasswordModal({ 
  visible, 
  onCancel, 
  onSubmit, 
  currentPassword, 
  setCurrentPassword, 
  newPassword, 
  setNewPassword, 
  passwordError 
}) {
  return (
    <Modal
      title="Change Password"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Current Password"
          validateStatus={passwordError.currentPassword ? "error" : ""}
          help={passwordError.currentPassword || ""}
        >
          <Input.Password
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
          />
        </Form.Item>
        
        <Form.Item
          label="New Password"
          validateStatus={passwordError.newPassword ? "error" : ""}
          help={passwordError.newPassword || ""}
        >
          <Input.Password
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
        </Form.Item>
        
        {passwordError.general && (
          <div style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>
            {passwordError.general}
          </div>
        )}
        
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update Password
          </Button>
        </Form.Item>
        
        <div style={{ color: '#555', marginTop: 8, textAlign: 'center', fontSize: 13 }}>
          Upon successful update of password, you will be logged out. You should then log back in with your new password.
        </div>
      </Form>
    </Modal>
  );
}

export default ChangePasswordModal;
