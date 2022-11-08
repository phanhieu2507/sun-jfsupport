import React from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
import './style.scss'

const { TextArea } = Input

const toHalfWidth = (v) => v.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))

const Detail = ({ form, input, setInput }) => {
  const onValueNameChange = (e) => {
    setInput(e.target.value)
    form.setFieldsValue({
      description: toHalfWidth(e.target.value),
    })
  }
  return (
    <div className="description">
      <Form.Item name="description" className="justify-evenly w-full">
        <TextArea
          rows={7}
          placeholder="何かを入力してください"
          onChange={onValueNameChange}
          defaultValue={input}
        />
      </Form.Item>
    </div>
  )
}

export default Detail

Detail.propTypes = {
  form: PropTypes.object.isRequired,
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
}
