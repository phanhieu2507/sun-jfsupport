import { Form, Modal, Button, Input, notification } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { updatePassword } from '../../../api/profile'
import { webInit } from '../../../api/web-init'
import './style.scss'

const ButtonChangePassword = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDisableOk, setIsDisableOk] = useState(true)
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false)
  const [isPasswordOkLoading, setIsPasswordOkLoading] = useState(false)
  const [form] = Form.useForm()
  const router = useRouter()

  const validateMessages = {
    required: 'この項目は必須です。',
    string: {
      range: 'パスワードは8文字以上24文字以下で入力してください。',
    },
  }
  const openNotification = (type, message) => {
    notification[type]({
      message,
      duration: 3,
    })
  }

  const handleCancel = () => {
    const currentPassword = form.getFieldValue('current_password')
    const password = form.getFieldValue('password')
    const confirmPassword = form.getFieldValue('confirm_password')
    if (currentPassword || password || confirmPassword) {
      setIsCancelModalVisible(true)
    } else {
      setIsModalVisible(false)
      form.setFieldsValue({ current_password: '', password: '', confirm_password: '' })
    }
  }

  const handleOkCancelModel = () => {
    setIsCancelModalVisible(false)
    setIsModalVisible(false)
    form.setFieldsValue({ current_password: '', password: '', confirm_password: '' })
  }

  const handleOk = () => {
    setIsPasswordOkLoading(true)
    webInit().then((res) => {
      const id = res.data.auth.user.id
      const arg = {
        current_password: form.getFieldValue('current_password'),
        password: form.getFieldValue('password'),
        comfirm_password: form.getFieldValue('confirm_password'),
      }
      updatePassword(id, arg).then((response) => {
        if (response.data.message === 'Current password incorrect') {
          form.setFields([
            {
              name: 'current_password',
              errors: ['現在のパスワードは間違っています'],
            },
          ])
          setIsPasswordOkLoading(false)
          setIsDisableOk(true)
        } else if (arg.current_password === arg.password.trim()) {
          form.setFields([
            {
              name: 'password',
              errors: ['新しいパスワードは古いパスワードに重なっています。別のパスワードを入力してください。'],
            },
          ])
          setIsPasswordOkLoading(false)
          setIsDisableOk(true)
        } else {
          setIsModalVisible(false)
          setIsPasswordOkLoading(false)
          openNotification('success', 'パスワードを正常に変更しました。')
          form.setFieldsValue({ current_password: '', password: '', confirm_password: '' })
        }
      }).catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
    })
  }

  const onChangeDisableOk = () => {
    const currentPassword = form.getFieldValue('current_password')
    const password = form.getFieldValue('password')
    const confirmPassword = form.getFieldValue('confirm_password')
    if (!currentPassword || (currentPassword.length < 8 || currentPassword.length > 24)) {
      setIsDisableOk(true)
      return
    }
    if (!password || (password.length < 8 || password.length > 24)) {
      setIsDisableOk(true)
      return
    }
    if (!confirmPassword || confirmPassword !== password) {
      setIsDisableOk(true)
      return
    }
    setIsDisableOk(false)
  }

  const validatorPass = (_, value) => {
    if (value.indexOf(' ') >= 0) {
      return Promise.reject(new Error('半角英数と記号のみを使用して入力してください。例：123example@!'))
    }
    if (value.length > 0 && (value.length < 8 || value.length > 24)) {
      return Promise.reject(new Error('パスワードは8文字以上24文字以下で入力してください。'))
    }
    return Promise.resolve()
  }
  return (
    <div>
      <Button type="primary" borderRadius="5px" size="large" onClick={() => setIsModalVisible(true)}>
        パスワード変更
      </Button>
      <Modal
        className="modal-change-password"
        title="パスワード変更"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        okText="保存"
        cancelText="キャンセル"
        maskClosable={false}
        okButtonProps={{
          disabled: isDisableOk,
          loading: isPasswordOkLoading,
        }}
      >
        <Form
          form={form}
          name="reset_password"
          layout="vertical"
          onValuesChange={onChangeDisableOk}
          validateMessages={validateMessages}
        >
          <Form.Item
            label={
              <p className="font-bold">現在のパスワード</p>
            }
            className="no-border"
            name="current_password"
            rules={[
              { required: true },
              {
                validator: validatorPass,
              },
            ]}
          >
            <Input.Password placeholder="現在のパスワードを入力してください。" />
          </Form.Item>

          <Form.Item
            label={
              <p className="font-bold">新しいパスワード</p>
            }
            className="no-border"
            name="password"
            rules={[
              { required: true },
              {
                validator: validatorPass,
              },
            ]}
          >
            <Input.Password placeholder="新しいパスワードを入力してください。" />
          </Form.Item>

          <Form.Item
            label={
              <p className="font-bold">新しいパスワード(再確認)</p>
            }
            className="no-border"
            name="confirm_password"
            dependencies={['password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value !== '' && getFieldValue('password') !== value) {
                    return Promise.reject(
                      new Error(
                        '新しいパスワードとパスワード確認用が一致しません。',
                      ),
                    )
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input.Password placeholder="パスワード確認用を入力してください。" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width="650px"
        centered
        visible={isCancelModalVisible}
        title="パスワード変更"
        onOk={handleOkCancelModel}
        onCancel={() => setIsCancelModalVisible(false)}
        footer={[
          <Button size="large" key="back" onClick={() => setIsCancelModalVisible(false)}>
            いいえ
          </Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOkCancelModel}>
            はい
          </Button>,
        ]}
      >
        <p>変更内容が保存されません。よろしいですか？</p>
      </Modal>
    </div>
  )
}

export default ButtonChangePassword
