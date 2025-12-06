import React from "react";
import { Card, Button, Form, Select } from "antd";
import { useEnums } from "../EnumsContext";

function PreferencesCard({ preferences, onChange, onSearch, loading }) {
  const { enums } = useEnums();
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (preferences && Object.keys(preferences).length > 0) {
      form.setFieldsValue(preferences);
    }
  }, [preferences, form]);

  return (
    <Card title="What are you looking for in your hiking partner?" style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(_, allValues) => onChange(allValues)}
        initialValues={preferences}
      >
        <Form.Item label="Their Experience Level" name="experienceLevel">
          <Select allowClear options={enums.experienceLevels.map(opt => ({ label: opt.displayName, value: opt.name }))} />
        </Form.Item>
        <Form.Item label="Their Pace" name="pace">
          <Select allowClear options={enums.paceOptions.map(opt => ({ label: opt.displayName, value: opt.name }))} />
        </Form.Item>
        <Form.Item label="Their Region" name="region">
          <Select allowClear options={enums.regionOptions.map(opt => ({ label: opt.displayName, value: opt.name }))} />
        </Form.Item>
        <Form.Item label="Their Languages" name="languages">
          <Select mode="multiple" allowClear options={enums.languageOptions.map(opt => ({ label: opt.displayName, value: opt.name }))} />
        </Form.Item>
        <Form.Item label="Their Hike Types" name="hikeTypes">
          <Select mode="multiple" allowClear options={enums.hikeTypeOptions.map(opt => ({ label: opt.displayName, value: opt.name }))} />
        </Form.Item>
        <Button type="primary" htmlType="submit" onClick={onSearch} loading={loading} style={{ marginTop: 8 }}>
          Search
        </Button>
      </Form>
    </Card>
  );
}

export default PreferencesCard;
