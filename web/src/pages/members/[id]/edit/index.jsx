/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input, Button, notification, Select, Modal } from 'antd'
import { useRouter } from 'next/router'
// import PropTypes from 'prop-types'
import Layout from '../../../../layouts/OtherLayout'
import './styles.scss'
import { MemberApi } from '~/api/member'
import { CategoryApi } from '~/api/category'
import Loading from '../../../../components/loading'
import * as Extensions from '../../../../utils/extensions'

const EditMember = () => {
  const [form] = Form.useForm()
  // const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalCancelVisible, setIsModalCancelVisible] = useState(false)
  const [emailInput, setEmailInput] = useState()
  const [nameInput, setNameInput] = useState()
  const [wasEditted, setWasEditted] = useState(false)
  const router = useRouter()
  const [categories, setCategories] = useState()
  const [categoriesSystem, setCategoriesSystem] = useState([])
  const [reqCategories, setReqCategories] = useState()
  const [showExitPrompt, setShowExitPrompt] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const { id } = router.query
  useEffect(async () => {
    try {
      const res = await MemberApi.getMemberDetail(id)
      const dataRes = res.data
      setEmailInput(dataRes.user.email)
      setNameInput(dataRes.user.name)
      setCategories(dataRes.categories.map((item) => item.id))
      setReqCategories(dataRes.categories.map((item) => item.id))
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }, [])
  useEffect(() => {
    form.setFieldsValue({
      name: nameInput,
      email: emailInput,
      categories,
    })
    // setEmailInput(emailInput)
    // setNameInput(nameInput)
  }, [emailInput, nameInput, categories])
  const onValueNameChange = (e) => {
    setWasEditted(true)
    setNameInput(e.target.value)
    setShowExitPrompt(true)
  }

  const onValueEmailChange = (e) => {
    setWasEditted(true)
    setEmailInput(e.target.value)
    setShowExitPrompt(true)
  }

  const fetchData = useCallback(() => {
    CategoryApi.getFullCategories().then((res) => {
      setCategoriesSystem(res.data)
    }).catch((error) => {
      if (error.response.status === 404) {
        router.push('/404')
      }
    })
  })

  const { Option } = Select

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
  }

  const handleOk = () => {
    setLoading(true)
    // setIsModalVisible(false)
    // setIsModalCancelVisible(false)
    MemberApi.updateMember(id, {
      name: nameInput,
      email: emailInput,
      categories: reqCategories,
    })
      .then(() => {
        router.push(`/members/${id}`)
        openNotificationSuccess()
      })
      .catch((error) => {
        // const errorMessage = error.response.data.errors.name[0]
        if (error.response.status === 404) {
          router.push('/404')
        } else {
          notification.error({
            message: 'メールは既に存在します。別のメールを入力してください',
            duration: 3,
          })
          return error
        }
        return error
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const onFinishFailed = () => {
    // errorInfo.errorFields.forEach((error) => {
    //   notification.error({
    //     message: error.errors[0],
    //     duration: 3,
    //   })
    // })
  }

  // const handleCancel = () => {
  //   setIsModalVisible(false)
  // }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(`/members/${id}`)
  }

  // const showModal = () => {
  //   if (
  //     form.getFieldsError().filter(({ errors }) => errors.length).length === 0
  //   ) {
  //     setIsModalVisible(true)
  //   }
  // }

  const showCancelModal = () => {
    setIsModalCancelVisible(true)
  }

  const handleCancelModal = () => {
    setIsModalCancelVisible(false)
  }

  const handleChangeSelect = (value) => {
    setWasEditted(true)
    setCategories(value)
    setReqCategories(value)
    setShowExitPrompt(true)
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
    setLoading(false)
  }, [])

  useEffect(() => {
    Extensions.unSaveChangeConfirm(showExitPrompt)
  }, [showExitPrompt])

  const emailValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    if (!value.match(Extensions.Reg.email)) {
      return Promise.reject(new Error('メールアドレスは次のようなフォーマットで入力してください! 例：email@example.com'))
    }
    return Promise.resolve()
  }
  return (
    <div>

      <Loading loading={isLoading} overlay={isLoading} />
      <Layout>
        <Layout.Main>
          <h1>メンバ編集</h1>
          <div className="flex flex-col items-center inviteWrapper">
            <Form
              colon={false}
              className="w-2/5"
              labelCol={{ span: 8 }}
              onFinish={handleOk}
              onFinishFailed={onFinishFailed}
              labelAlign="right"
              form={form}
              size="large"
            >
              <Form.Item
                name="name"
                label={<span className="font-bold">フルネーム</span>}
                rules={[
                  {
                    message: 'この項目は必須です',
                    required: true,
                  },
                  () => ({
                    validator(_, value) {
                      if (/[0-9]/.test(value)) {
                        return Promise.reject(
                          new Error('数字を入力しないでください。'),
                        )
                      }
                      if (
                        /[?!@#$%^&*()_+\-=[\]{};':"\\/|,<>]/.test(value)
                      ) {
                        return Promise.reject(
                          new Error('特殊文字を入力しないでください。'),
                        )
                      }

                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <Input
                  onChange={onValueNameChange}
                  type="name"
                  value={nameInput}
                  // defaultValue={nameInput}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label={(
                  <span style={{ fontSize: '14px' }} className="font-bold">
                    メールアドレス
                  </span>
                )}
                rules={[
                  {
                    validator: emailValidator,
                  },
                ]}
              >
                <Input
                  onChange={onValueEmailChange}
                  type="text"
                  placeholder="メールアドレスを入力してください。"
                  // defaultValue={emailInput}
                  value={emailInput}
                />
              </Form.Item>

              <Form.Item
                name="categories"
                label={(
                  <span style={{ fontSize: '14px' }} className="font-bold">
                    カテゴリ
                  </span>
                )}
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  // defaultValue={categories}
                  onChange={handleChangeSelect}
                  placeholder="カテゴリ"
                  size="large"
                  className="selectBar"
                  filterOption={(input, option) => (
                    option.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  )}
                >
                  {categoriesSystem.map((item) => (
                    <Option key={item.id} value={item.id}>
                      <p>{item.category_name}</p>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <div className="flex justify-end">
                  <Modal
                    title="メンバ編集"
                    visible={isModalCancelVisible}
                    onOk={handleClick}
                    onCancel={handleCancelModal}
                    cancelText="いいえ"
                    okText="はい"
                    centered
                  >
                    <p className="mb-5">
                      変更内容が保存されません。よろしいですか？
                    </p>
                  </Modal>

                  <Button size="large" onClick={wasEditted ? showCancelModal : handleClick}>
                    キャンセル
                  </Button>
                  <Button
                    size="large"
                    className="ml-4"
                    type="primary"
                    htmlType="submit"
                    // onClick={handleOk}
                  >
                    保存
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Layout.Main>
      </Layout>
    </div>
  )
}

// EditMember.getInitialProps = async (ctx) => {
// const { id } = ctx.query
// const res = await MemberApi.getMemberDetail(id)
// const dataRes = res.data
// return { data: dataRes }
// }

// EditMember.propTypes = {
//   data: PropTypes.object.isRequired,
// }

EditMember.middleware = ['auth:superadmin']
export default EditMember
