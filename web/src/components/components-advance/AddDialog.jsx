/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { CloseCircleOutlined, CheckOutlined } from '@ant-design/icons'
import './AddDialog.module.scss'

export const AddDialog = ({ handleAddText, handleCloseDialog }) => {
  const [text, setText] = useState('')
  const handleCancel = () => {
    setText('')
    handleCloseDialog()
  }

  const handleChangeText = (e) => {
    setText(e.target.value)
  }

  const handleSubmit = () => {
    handleCloseDialog()
    handleAddText(text)
  }
  return (

    <div className="addText">
      <input
        className="input_edit"
        onChange={handleChangeText}
      />
      <a
        className=""
        onClick={handleSubmit}
        disabled={text === ''}
      >
        <CheckOutlined className="mx-1" />
      </a>
      <a className="" onClick={handleCancel}>
        <CloseCircleOutlined className="" />
      </a>

    </div>
  )
}
