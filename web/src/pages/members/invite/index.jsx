import React, { useState, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Form, Input, Button, Modal, notification, Space } from 'antd'
import { useRouter } from 'next/router'
import OtherLayout from '../../../layouts/OtherLayout'
import 'antd/dist/antd.css'
import './styles.scss'
import { sendInviteLink } from '~/api/member'
import Loading from '../../../components/loading'

function InviteMember() {
  const [emailInput, setEmailInput] = useState('')
  const router = useRouter()
  const [form] = Form.useForm()
  const [, forceUpdate] = useState({})
  const [changeEmail, setChangeEmail] = useState(false)
  const [isLoading, setLoading] = useState(false)

  // Disable button when reload page
  useEffect(() => {
    forceUpdate({})
  }, [])

  const onValueEmailChange = (e) => {
    document.getElementById('errorEmail').setAttribute('hidden', true)
    setChangeEmail(true)
    setEmailInput(e.target.value)
  }

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: 'この項目は必須です。',
    types: {
      email: '',
    },
    email: {
      message: '${message}',
    },
  }

  const isEmptyForm = () => {
    const inputValues = form.getFieldsValue()
    //  return type :[]
    const inputs = Object.values(inputValues)

    for (let i = 0; i < inputs.length; i += 1) {
      const element = inputs[i]
      if (element) {
        return false
      }
    }
    return true
  }

  const handleModal = () => {
    if (isEmptyForm() && !changeEmail) {
      router.push('/members')
    } else {
      return Modal.confirm({
        title: '変更は保存されていません。続行してもよろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk: () => {
          router.push('/members')
        },
        onCancel: () => {},
        centered: true,
        okText: 'はい',
        cancelText: 'いいえ',
      })
    }
    return null
  }

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 3,
    })
  }

  const handleInvite = async () => {
    const email = form.getFieldValue('email')
    setLoading(true)
    try {
      const response = await sendInviteLink({ email })
      if (response.request.status === 200) {
        form.resetFields()
        setEmailInput('')
        openNotification(
          'success',
          'ご登録のメールアドレスに招待メールを送信しました。',
        )
      }
    } catch (error) {
      if (error.request.status === 400) {
        document.getElementById('errorEmail').removeAttribute('hidden')
      }
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
    setLoading(false)
  }

  return (
    <div>
      <Loading loading={isLoading} overlay={isLoading} />
      <OtherLayout>
        <OtherLayout.Main>
          <h1>メンバ招待</h1>
          <div className="invite-member-page">
            <div className="container mx-auto flex-1 justify-center px-4 pb-20">
              <div className="flex justify-center">
                <Form
                  form={form}
                  labelCol={{
                    span: 6,
                  }}
                  wrapperCol={{
                    span: 14,
                  }}
                  layout="horizontal"
                  size="large"
                  colon={false}
                  className="invite-member-form"
                  labelAlign="right"
                  onFinish={handleInvite}
                  validateMessages={validateMessages}
                >
                  <Form.Item
                    label={<p className="font-bold">メールアドレス</p>}
                    required
                  >
                    <Form.Item
                      name="email"
                      label={<p className="font-bold">メールアドレス</p>}
                      noStyle
                      rules={[
                        {
                          type: 'email',
                          message: 'メールアドレスは次のようなフォーマットで入力してください! 例：email@example.com',
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        name="email"
                        className="py-2"
                        onChange={onValueEmailChange}
                        type="email"
                        placeholder="メールアドレスを入力してください。"
                        initialValues={emailInput}
                      />
                    </Form.Item>
                    <span id="errorEmail" hidden>
                      このメールは既に存在しました
                    </span>
                  </Form.Item>

                  <Form.Item label=" " className="my-10">
                    <Space size={20} className="flex justify-end">
                      <Button
                        className="ant-btn"
                        id="btn-cancel"
                        size="large"
                        onClick={handleModal}
                      >
                        キャンセル
                      </Button>
                      <Button
                        id="btn-submit"
                        type="primary"
                        size="large"
                        htmlType="submit"
                      >
                        招待
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}

InviteMember.middleware = ['auth:superadmin']
export default InviteMember
