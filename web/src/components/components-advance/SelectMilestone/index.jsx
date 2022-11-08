/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import {
  Select,
  Form,
} from 'antd'
import './style.scss'
// selectMilestone
function SelectML({ onMilestoneChange, listMilestone }) {
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({
      milestone: listMilestone.length > 0 ? listMilestone[0].id : null,
    })
  }, [listMilestone])
  return (
    <div className="selectMilestone">
      <Form
        form={form}
        colon={false}
        initialValues={{ milestone: listMilestone.length > 0 ? listMilestone[0].id : null }}
      >
        <Form.Item
          name="milestone"
        >
          <Select
            size="large"
            className="addJF-selector"
            style={{ width: '300px' }}
            onChange={onMilestoneChange}
            defaultActiveFirstOption={false}
            // placeholder={listMilestone.length > 0 ? listMilestone[0].name : null}
          >
            { listMilestone && listMilestone.map((element) => (
              <Select.Option key={element.id} value={element.id}>
                {element.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

    </div>
  )
}

export default SelectML
