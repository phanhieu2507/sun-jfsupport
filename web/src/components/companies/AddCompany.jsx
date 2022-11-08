/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState } from 'react'
import { Modal, Button, notification, Form, Input } from 'antd'
import { useRouter } from 'next/router'
import { addCompany, checkUniqueAdd } from '../../api/company'
import Loading from '../loading'
import * as Extensions from '~/utils/extensions'
import './style.scss'

const AddCompany = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [company, setCompany] = useState('')
  const [form] = Form.useForm()
  const specialCharRegex = new RegExp('[\\s]')
  const [checkSpace, setCheckSpace] = useState(false)
  const role = props.role
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function toHalfWidth(fullWidthStr) {
    return fullWidthStr.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
  }

  const showModal = () => {
    setIsModalVisible(true)
  }
  const setReloadPage = () => {
    props.reloadPage()
    setIsModalVisible(false)
  }

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
    setReloadPage()
  }

  const checkError = async (name) => {
    let isError = true
    if (name && name.trim().length !== 0 && name.trim().length <= 100) {
      const res = await checkUniqueAdd({ name: name.trim() })
      if (res?.data?.company_name) {
        form.setFields([
          {
            name: 'name',
            errors: ['この企業名は存在しています'],
          },
        ])
      } else {
        isError = false
      }
    } else if (name && name.trim().length === 0) {
      form.setFields([
        {
          name: 'name',
          errors: ['この項目は必須です。'],
        },
      ])
    } else if (name && name.length > 100) {
      form.setFields([
        {
          name: 'name',
          errors: ['入力した企業名は大きいです。'],
        },
      ])
    }
    return isError
  }

  const handleOk = async () => {
    if (role === 'superadmin') {
      const isError = await checkError(company)
      if (isError === false) {
        setLoading(true)
        addCompany({
          company_name: company,
        })
          .then(
            () => {
              openNotificationSuccess()
              form.resetFields()
            },
          )
          .catch((err) => {
            if (err.response.status === 404) {
              router.push('/404')
            }
          })
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const onBlur = () => {
    checkError(company)
  }

  const onValueNameChange = (e) => {
    setCheckSpace(false)
    setCompany(toHalfWidth(e.target.value))
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
  }

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        size="large"
        className="ant-btn"
        style={{ letterSpacing: '-0.1em' }}
      >
        <span>追加</span>
      </Button>
      <Modal
        className="add-company"
        title="企業追加"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="登録"
        cancelText="キャンセル"
        okButtonProps={{ style: { letterSpacing: '-0.1em' } }}
        centered
      >
        <Loading loading={loading} overlay={loading} />
        <Form
          form={form}
          layout="horizontal"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          colon={false}
        >
          <Form.Item
            label={<span className="font-bold mr-3">企業名</span>}
            name="name"
            rules={[
              {
                required: true,
                message: 'この項目は必須です。',
              },
              {
                max: 255,
                message: '入力され企業名は少し長いです。',
              },
            ]}
          >
            <Input
              type="text"
              placeholder="例: Sun Asterisk"
              className="input-company"
              required="required"
              style={{ width: '-webkit-fill-available', paddingLeft: 10, marginTop: -4 }}
              onChange={onValueNameChange}
              onBlur={onBlur}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddCompany
