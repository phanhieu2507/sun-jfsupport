/* eslint-disable import/named */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState, useEffect } from 'react'
import { Modal, Form, notification, Input, InputNumber } from 'antd'
import { useRouter } from 'next/router'
import { EditTwoTone } from '@ant-design/icons'
import { updateCompany, getCompanies, checkUniqueEdit } from '../../api/company'
import Loading from '../loading'
// import { getNameExitEdit } from '../../api/milestone'

const EditCompany = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [checkSpace, setCheckSpace] = useState(false)
  const [form] = Form.useForm()
  const specialCharRegex = new RegExp('[ 　]')
  const role = props.role
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  function toHalfWidth(fullWidthStr) {
    return fullWidthStr.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
  }

  useEffect(async () => {
    const record = props.record
    setLoading(false)
    setNameInput(record.name)
    form.setFieldsValue({
      name: record.name,
    })
  }, [])

  const setReloadPage = () => {
    props.reloadPage()
  }

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
    setIsModalVisible(false)
    setReloadPage()
  }

  const checkError = async (id, name) => {
    let isError = true
    if (name && name.trim().length > 0 && name.length <= 100) {
      const res = await checkUniqueEdit({ id, name: name.trim() })
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

  const onBlur = () => {
    checkError(props.record.id, nameInput)
  }

  const onValueNameChange = (e) => {
    setCheckSpace(false)
    setNameInput(toHalfWidth(e.target.value))
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
  }

  const showModal = (e) => {
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    if (role === 'superadmin') {
      const id = props.record.id
      const name = nameInput
      const isError = await checkError(id, name)
      if (isError === false) {
        setLoading(true)
        updateCompany(id, {
          company_name: name,
        }).then(() => {
          openNotificationSuccess()
        }).catch((err) => {
          if (err.response.status === 404) {
            router.push('/404')
          }
        })
      }
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }

  return (
    <>
      <EditTwoTone onClick={showModal} />
      <div>
        <Modal
          title="企業編集"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="保存"
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
                  max: 100,
                  message: '入力された企業名は少し長いです。',
                },
              ]}
            >
              <Input
                type="text"
                required="required"
                className="input-category"
                style={{ width: '-webkit-fill-available', paddingLeft: 10, marginTop: -4 }}
                onChange={onValueNameChange}
                onBlur={onBlur}
                placeholder="企業名を書いてください"
                defaultValue={props.record.name}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default EditCompany
