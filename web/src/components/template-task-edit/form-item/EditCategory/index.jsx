import React, { useEffect, useState } from 'react'
import { Form, Select } from 'antd'
import './style.scss'
import PropTypes from 'prop-types'

const { Option } = Select

const toHalfWidth = (v) => v.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
const ItemDropdow = ({ form, setConfilm, display, name, setCheckSpace, data, setInput, setId }) => {
  const [fieldName, setFieldName] = useState('')
  const onValueNameChange = (value) => {
    setConfilm(true)
    setCheckSpace(false)
    setInput(value)
    const temp = {}
    temp[name] = toHalfWidth(value)
    form.setFieldsValue(temp)
    if (name === 'category') {
      setId(data.find((item) => item.category_name === value).id)
    } else {
      setId(data.find((item) => item.name === value).id)
    }
  }
  useEffect(() => {
    if (name === 'category') {
      setFieldName('category_name')
    } else {
      setFieldName('name')
    }
  }, [])
  const DropdownValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    return Promise.resolve()
  }
  return (
    <Form.Item
      noStyle
      labelAlign="left"
      name={name}
      rules={[
        {
          validator: DropdownValidator,
        },
      ]}
    >
      <Select
        onChange={onValueNameChange}
        placeholder="カテゴリ"
        size="large"
        style={{ display: display ? 'none' : '' }}
      >
        {data.map((item) => (
          <Option key={item.id} value={item[fieldName]}>
            {item[fieldName]}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default ItemDropdow

ItemDropdow.propTypes = {
  form: PropTypes.object.isRequired,
  display: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  setCheckSpace: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  setInput: PropTypes.func.isRequired,
  setId: PropTypes.func.isRequired,
  setConfilm: PropTypes.func.isRequired,
}
