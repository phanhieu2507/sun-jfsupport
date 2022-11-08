import React, { useState } from 'react'
import { Form, Input, Button, notification } from 'antd'
import { useRouter } from 'next/router'
import Layout from '~/layouts/Default'
import { updatePassword } from '~/api/authenticate'
import Loading from '../../components/loading'
import './style.scss'
import '../global.scss'

const ResetPage = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const { token } = router.query

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 3,
    })
  }

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: 'この項目は必須です。',
    types: {
      string: '',
    },
    string: {
      range: 'パスワードは${min}文字以上${max}文字以下で入力してください。',
    },
  }
  /* eslint-enable no-template-curly-in-string */

  const onFinish = async (values) => {
    const data = {
      token,
      password: values.confirm_password,
    }
    setLoading(true)
    try {
      const response = await updatePassword(data)
      if (response.request.status === 200) {
        router.push('/')
        openNotification('success', 'パスワードを正常に変更しました')
      }
    } catch (error) {
      if (error.request.status === 400) {
        openNotification('error', 'パスワードを正常に変更しません')
      }
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
    setLoading(false)
  }

  const onFinishFailed = (errorInfo) => {
    openNotification('error', errorInfo)
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
      <Loading loading={isLoading} overlay={isLoading} />
      <Layout>
        <Layout.Main>
          <div className="h-screen flex flex-col items-center bg-white pt-32">
            <img src="/images/logo.png" alt="logo" className="w-48" />
            <p className="text-3xl my-8">パスワード変更</p>
            <Form
              form={form}
              name="reset_password"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="w-96"
              validateMessages={validateMessages}
            >
              <Form.Item
                label={<p className="font-bold">新しいパスワード</p>}
                name="password"
                rules={[
                  { required: true },
                  {
                    validator: validatorPass,
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="新しいパスワードを入力してください。" />
              </Form.Item>

              <Form.Item
                label={<p className="font-bold">パスワード確認用</p>}
                name="confirm_password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(
                        new Error(
                          '新しいパスワードとパスワード確認用が一致しません。',
                        ),
                      )
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="パスワード確認用を入力してください。" />
              </Form.Item>

              <Form.Item shouldUpdate>
                {() => (
                  <div className="flex justify-center">
                    <Button
                      style={{ height: '38px' }}
                      type="primary"
                      htmlType="submit"
                      className="text-base px-14"
                      disabled={
                        !(
                          form.isFieldTouched('password')
                          && form.isFieldTouched('confirm_password')
                        )
                        || !!form
                          .getFieldsError()
                          .filter(({ errors }) => errors.length).length
                      }
                    >
                      保存
                    </Button>
                  </div>
                )}
              </Form.Item>
            </Form>
          </div>
        </Layout.Main>
      </Layout>
    </div>
  )
}

export default ResetPage
