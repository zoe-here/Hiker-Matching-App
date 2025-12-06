import React from "react";
import { Modal, Form, Button, Select, Checkbox } from "antd";

function EditBioModal({ 
  visible, 
  onCancel, 
  onSubmit, 
  enums, 
  loading, 
  bioErrors, 
  watch, 
  setValue 
}) {
  return (
    <Modal
      title="Edit Bio Data"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Experience Level"
          validateStatus={bioErrors.ownExperienceLevel ? "error" : ""}
          help={bioErrors.ownExperienceLevel?.message || ""}
        >
          <Select
            value={watch("ownExperienceLevel")}
            onChange={(val) => setValue("ownExperienceLevel", val)}
            placeholder="Select Experience Level"
          >
            {enums.experienceLevels.map((opt) => (
              <Select.Option key={opt.name} value={opt.name}>
                {opt.displayName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          label="Pace"
          validateStatus={bioErrors.ownPace ? "error" : ""}
          help={bioErrors.ownPace?.message || ""}
        >
          <Select
            value={watch("ownPace")}
            onChange={(val) => setValue("ownPace", val)}
            placeholder="Select Pace"
          >
            {enums.paceOptions.map((opt) => (
              <Select.Option key={opt.name} value={opt.name}>
                {opt.displayName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          label="Region"
          validateStatus={bioErrors.ownRegion ? "error" : ""}
          help={bioErrors.ownRegion?.message || ""}
        >
          <Select
            value={watch("ownRegion")}
            onChange={(val) => setValue("ownRegion", val)}
            placeholder="Select Region"
          >
            {enums.regionOptions.map((opt) => (
              <Select.Option key={opt.name} value={opt.name}>
                {opt.displayName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          label="Languages"
          validateStatus={bioErrors.ownLanguages ? "error" : ""}
          help={bioErrors.ownLanguages?.message || ""}
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
          validateStatus={bioErrors.ownHikeTypes ? "error" : ""}
          help={bioErrors.ownHikeTypes?.message || ""}
        >
          <Checkbox.Group
            options={enums.hikeTypeOptions.map((opt) => ({
              label: opt.displayName,
              value: opt.name,
            }))}
            value={watch("ownHikeTypes")}
            onChange={(vals) => setValue("ownHikeTypes", vals)}
          />
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

export default EditBioModal;
