import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Form, Input, Button, notification, Avatar } from 'antd'
import cookies from 'axios/lib/helpers/cookies'
import Otherlayout from '../../../layouts/OtherLayout'
// import Avatar from '../UI/avatar/Avatar'
import ButtonChangePassword from '../../../components/profile/ButtonChangePassword'
import CancelEditProfile from '../../../components/profile/CancelEditProfile'
import {
  updateInfo,
  getAllProfile,
  getProfile,
  getAvatar,
} from '../../../api/profile'
import { webInit } from '../../../api/web-init'
import axios from '../../../api/axios'
import './styles.scss'
import Loading from '../../../components/loading'

const EditProfilePage = () => {
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [idSlackInput, setIdSlackInput] = useState('')
  const [form] = Form.useForm()
  const [image, setImage] = useState()
  const [avatarUser, setAvatarUser] = useState()
  const [preview, setPreview] = useState()
  const [isDisable, setIsDisable] = useState(false)
  const [pathName, setPathName] = useState()
  const [loading, setLoading] = useState(false)
  const [prevData, setPrevData] = useState({})
  const router = useRouter()

  webInit().then((res) => {
    const id = res.data.auth.user.id
    getAvatar(id)
      .then((response) => {
        if (!response.data) {
          setAvatarUser(null)
        } else {
          const link = `../../api/avatar/${id}`
          setAvatarUser(link)
        }
      })
      .catch(() => setAvatarUser(null))
  }, [])

  const updateAvt = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('avatar', image)

    try {
      const res = await webInit()
      const id = res.data.auth.user.id
      const { data } = await axios.post(
        `/profile/${id}/update_avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': cookies.read('XSRF-TOKEN'),
          },
        },
      )
      setLoading(false)
      return data
    } catch (error) {
      setLoading(false)
      if (error.response.status === 404) {
        router.push('/404')
      }
      return null
    }
  }

  useEffect(() => {
    if (image) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(image)
    }
  }, [image])

  useEffect(async () => {
    setLoading(true)
    try {
      const resId = await webInit()
      const id = resId.data.auth.user.id
      const result = await getProfile(id)
      const data = result.data
      setNameInput(data.name)
      setIdSlackInput(data.chatwork_id)
      setEmailInput(data.email)
      setPathName(data.avatar)
      form.setFieldsValue({
        name: data.name,
        chatwork: data.chatwork_id,
        email: data.email,
      })
      setPrevData({
        name: data.name,
        email: data.email,
        idSlack: data.chatwork_id,
        avatar: data.avatar,
      })
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }, [])

  const fetchData = async (emailIn, nameIn) => {
    setLoading(true)
    try {
      const resId = await webInit()
      const id = resId.data.auth.user.id
      const resCur = await getProfile(id)
      const emailCur = resCur.data.email
      const nameCur = resCur.data.name
      const res = await getAllProfile()
      const dataEmail = res.data.map((item) => item.email)
      const email = dataEmail.find((item) => item === emailIn)
      const dataName = res.data.map((item) => item.name)
      const name = dataName.find((item) => item === nameIn)
      // alert(nameInput)
      if (email && email !== emailCur) {
        setIsDisable(true)
        form.setFields([
          {
            name: 'email',
            errors: ['このメールは既に存在しました。'],
          },
        ])
      }
      if (name && name !== nameCur) {
        setIsDisable(true)
        form.setFields([
          {
            name: 'name',
            errors: ['このユーザー名は既に存在しました。'],
          },
        ])
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)

      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(emailInput, nameInput)
      // fetchData(nameInput)
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [emailInput, nameInput])

  const openNotificationSuccess = () => {
    // router.push('/profile')
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
  }

  const handleOk = async () => {
    setLoading(true)
    if (nameInput === '' || emailInput === '' || idSlackInput === '' || isDisable === true) {
      if (idSlackInput === '') {
        form.setFields([
          {
            name: 'chatwork',
            errors: ['この項目は必須です。'],
          },
        ])
      }
      setIsDisable(true)
      setLoading(false)
    } else {
      let avtPath = pathName
      if (image) {
        avtPath = await updateAvt()
      }
      const data = await webInit()
      const id = data.data.auth.user.id
      updateInfo(id, {
        name: nameInput,
        email: emailInput,
        chatwork_id: idSlackInput,
        avatar: avtPath,
      }).then((res) => {
        if (res.request.status === 200) {
          router.push('/profile/')
          setLoading(false)
          openNotificationSuccess()
        }
      }).catch((error) => {
        if (error.response.status === 404) {
          setLoading(false)
          router.push('/404')
        }
        if (error.response.status === 422) {
          setLoading(false)
          notification.error({
            message: error.response.data.message,
            duration: 3,
            onClick: () => {},
          })
        }
      })
    }
  }

  const fileInputRef = useRef()

  const changeImageHandler = (e) => {
    const file = e.target.files[0]
    const fileType = file?.name.split('.')[file.name.split('.').length - 1]
    if (file) {
      if (file?.size > 4194304 || (fileType !== 'jpg' && fileType !== 'png')) {
        notification.error({
          message: '.jpg, .png, サイズ4MB未満の画像を選択してください',
          duration: 3,
        })
        setImage(null)
      } else {
        setImage(file)
        setIsDisable(false)
      }
    }
  }

  const clickHandler = (e) => {
    e.preventDefault()
    if (fileInputRef.current.value !== null) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    } else {
      fileInputRef.current.click()
    }
  }

  const onNameChange = (e) => {
    setIsDisable(false)
    setNameInput(e.target.value)
  }

  const onChatworkIdChange = (e) => {
    setIsDisable(false)
    setIdSlackInput(e.target.value)
  }

  const onEmailChange = (e) => {
    setIsDisable(false)
    setEmailInput(e.target.value)
  }

  const specialCharRegex = new RegExp('[ 　]')

  return (
    <div>
      {loading && <Loading loading={loading} overlay={loading} />}
      <Otherlayout>
        <Otherlayout.Main>
          <h1>プロフィール編集</h1>
          <div className="container__profile-edit">
            <div className="container-profile">
              <div className="grid justify-items-center">
                <div className="avatar h-28">
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => changeImageHandler(e)}
                  />
                  {preview ? (
                    <div onClick={clickHandler}>
                      <img src={preview} alt="user-img" />
                    </div>
                  ) : (
                    <div onClick={clickHandler}>
                      {avatarUser ? (
                        <Avatar
                          size={150}
                          src={avatarUser}
                        />
                      ) : (
                        <Avatar
                          size={150}
                          style={{
                            backgroundColor: '#FFD802',
                          }}
                          src="../images/avatars/default.jpg"
                        />
                      )}
                    </div>
                  )}
                </div>
                <ButtonChangePassword />
              </div>
              <div />
              <div className="container-form">
                <div className="flex my-14">
                  <Form
                    form={form}
                    name="basic"
                    size="large"
                    labelCol={{
                      span: 8,
                    }}
                    wrapperCol={{
                      span: 18,
                    }}
                    className="w-3/4"
                    colon={false}
                  >
                    <Form.Item
                      label={<span className="font-bold mr-3">ユーザー名</span>}
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: 'この項目は必須です。',
                        },
                        () => ({
                          validator(_, value) {
                            if (/[0-9]/.test(value)) {
                              setIsDisable(true)
                              return Promise.reject(
                                new Error('数字を入力しないでください。'),
                              )
                            }
                            if (
                              /[?!@#$%^&*()_+\-=[\]{};':"\\/|,<>]/.test(value)
                            ) {
                              setIsDisable(true)
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
                        type="text"
                        size="large"
                        onChange={onNameChange}
                        placeholder="ユーザー名"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-bold mr-3">Slack ID</span>}
                      name="chatwork"
                      rules={[
                        {
                          required: true,
                          message: 'この項目は必須です。',
                        },
                        () => ({
                          validator(_, value) {
                            if (specialCharRegex.test(value)) {
                              setIsDisable(true)
                              return Promise.reject(
                                new Error('スペースを入力しないでください。'),
                              )
                            }
                            if (
                              /[?!@#$%^&*()_+\-=[\]{};':"\\/|,.<>]/.test(value)
                            ) {
                              setIsDisable(true)
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
                        type="text"
                        size="large"
                        onChange={onChatworkIdChange}
                        placeholder="スラックID"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-bold mr-3">メール</span>}
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: 'この項目は必須です。',
                        },
                        () => ({
                          validator(_, value) {
                            if (
                              !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(
                                value,
                              )
                              && value !== ''
                            ) {
                              setIsDisable(true)
                              return Promise.reject(
                                new Error(
                                  'メールアドレスは次のようなフォーマットで入力してください! 例：email@example.com',
                                ),
                              )
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]}
                    >
                      <Input
                        type="text"
                        size="large"
                        onChange={onEmailChange}
                        placeholder="メールアドレスを入力してください。"
                      />
                    </Form.Item>
                  </Form>
                </div>
                <div className="container-btn justify-end gap-1 w-full">
                  <CancelEditProfile
                    currData={{
                      name: nameInput,
                      email: emailInput,
                      idSlack: idSlackInput,
                      avatar: pathName,
                    }}
                    inputData={prevData}
                  />
                  <Button
                    size="large"
                    type="primary"
                    className="text-base px-9"
                    htmlType="submit"
                    onClick={handleOk}
                  >
                    保存
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Otherlayout.Main>
      </Otherlayout>
    </div>
  )
}
EditProfilePage.middleware = ['auth:superadmin', 'auth:member']
export default EditProfilePage
