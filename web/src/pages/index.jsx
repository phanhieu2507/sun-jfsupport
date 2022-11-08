import React, { useState, useEffect, useContext } from 'react'
import { Form, Input, Button, Checkbox, Modal, notification } from 'antd'
import { useRouter } from 'next/router'
import { ReactReduxContext } from 'react-redux'
import Layout from '~/layouts/Default'
import { login, sendLinkResetPassword } from '~/api/authenticate'
import { LOAD_SUCCESS } from '../store/modules/auth'
import Loading from '../components/loading'
import './styles.scss'
import * as Extensions from '../utils/extensions'

const LoginPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDisableOk, setDisableOk] = useState(true)
  const [, forceUpdate] = useState({})
  const [form] = Form.useForm()
  const [form2] = Form.useForm()
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const { store } = useContext(ReactReduxContext)
  // To disable submit button at the beginning.
  useEffect(() => {
    const user = store.getState().get('auth').get('user')
    if (user) router.push('/top-page')
    forceUpdate({})
  }, [])

  /* eslint-disable no-template-curly-in-string */
  const validatorPass = (_, value) => {
    if (value.indexOf(' ') >= 0) {
      return Promise.reject(
        new Error(
          '半角英数と記号のみを使用して入力してください。例：123example@!',
        ),
      )
    }
    if (value.length > 0 && (value.length < 8 || value.length > 24)) {
      return Promise.reject(
        new Error('パスワードは8文字以上24文字以下で入力してください。'),
      )
    }
    if (value.length === 0) {
      return Promise.reject(new Error('この項目は必須です。'))
    }
    return Promise.resolve()
  }
  const validatorEmail = (_, value) => {
    if (value.length === 0) {
      return Promise.reject(new Error('この項目は必須です。'))
    }
    if (!value.match(Extensions.Reg.email)) {
      return Promise.reject(new Error('メールアドレスは次のようなフォーマットで入力してください! 例：email@example.com'))
    }
    return Promise.resolve()
  }
  // const validateMessages = {
  //   required: 'この項目は必須です。',
  //   types: {
  //     email: 'メールアドレスを正しく入力してください。',
  //     string: '',
  //   },
  //   string: {
  //     range: 'パスワードは${min}文字以上${max}文字以下で入力してください。',
  //   },
  // }
  /* eslint-enable no-template-curly-in-string */

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 2.5,
    })
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const response = await login(values)
      if (response.request.status === 200) {
        const { auth, preURL } = response.data
        store.dispatch({ type: LOAD_SUCCESS, payload: auth })
        if (preURL == null) {
          router.push('/top-page')
          setLoading(false)
        } else {
          router.push(preURL)
          setLoading(false)
        }
        openNotification('success', '正常にログインしました')
      }
    } catch (error) {
      setLoading(false)
      if (error.request.status === 400) {
        openNotification(
          'error',
          'メールアドレスもしくはパスワードが間違っています',
        )
      }
    }
  }

  const onChangeDisableOk = () => {
    setDisableOk(
      !form2.isFieldTouched('reset-email')
        || !!form2.getFieldsError().filter(({ errors }) => errors.length).length,
    )
  }

  const onFinishFailed = (errorInfo) => {
    openNotification('error', errorInfo)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    setIsModalVisible(false)
    setLoading(true)
    try {
      const response = await sendLinkResetPassword(
        form2.getFieldValue('reset-email'),
      )
      if (response.request.status === 200) {
        openNotification(
          'success',
          'メールは正常に送信されました',
          'メールを確認してください。',
        )
      }
    } catch (error) {
      if (error.request.status === 400) openNotification('error', 'メールが存在しません')
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div>
      <Loading loading={isLoading} overlay={isLoading} />
      <Layout>
        <Layout.Main>
          <div className="h-screen flex flex-col items-center bg-white pt-32">
            <img src="/images/logo.svg" alt="logo" className="w-48 mb-10" />
            <Form
              form={form}
              name="login"
              initialValues={{
                remember: false,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="w-96"
            >
              <Form.Item
                label={<p className="font-bold">メールアドレス</p>}
                name="email"
                required
                rules={[{ validator: validatorEmail }]}
              >
                <Input
                  size="large"
                  type="email"
                  placeholder="メールアドレスを入力してください。"
                />
              </Form.Item>

              <Form.Item
                label={<p className="font-bold">パスワード</p>}
                name="password"
                required
                rules={[
                  {
                    validator: validatorPass,
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  className="px-3"
                  placeholder="パスワードを入力してください。"
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <div className="flex justify-between item-center">
                  <Checkbox>ログインしたままにする</Checkbox>
                  <a className="text-blue-600" onClick={showModal}>
                    パスワードをお忘れの方
                  </a>
                </div>
              </Form.Item>

              <Modal
                title="パスワード変更"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="キャンセル"
                okButtonProps={{
                  disabled: isDisableOk,
                }}
                centered
              >
                <Form
                  form={form2}
                  name="reset-password"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  layout="vertical"
                  onValuesChange={onChangeDisableOk}
                >
                  <Form.Item
                    label={<p className="font-bold">メールアドレス</p>}
                    name="reset-email"
                    required
                    rules={[{ validator: validatorEmail }]}
                  >
                    <Input
                      type="email"
                      placeholder="メールアドレスを入力してください。"
                    />
                  </Form.Item>
                </Form>
              </Modal>

              <Form.Item shouldUpdate>
                {() => (
                  <div className="flex justify-center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="text-base px-14"
                      size="large"
                      disabled={
                        !(
                          form.isFieldTouched('email')
                          && form.isFieldTouched('password')
                        )
                        || !!form
                          .getFieldsError()
                          .filter(({ errors }) => errors.length).length
                      }
                    >
                      ログイン
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

export default LoginPage
