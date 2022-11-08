/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import { Avatar, notification } from 'antd'
import { EditTwoTone, UserOutlined } from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import { useRouter } from 'next/router'
import Otherlayout from '../../layouts/OtherLayout'
import { getProfile, getAvatar } from '../../api/profile'
import Loading from '../../components/loading'

const Profile = () => {
  const [avatarUser, setAvatarUser] = useState('')
  const [nameUser, setNameUser] = useState('')
  const [chatWorkIdUser, setChatWorkIdUser] = useState('')
  const [emailUser, setEmailUser] = useState('')
  const [loading, setLoading] = useState(false)
  const { store } = useContext(ReactReduxContext)

  const [user, setUser] = useState(null)

  const router = useRouter()
  useEffect(async () => {
    setLoading(true)
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      const id = user.get('id')
      try {
        await getProfile(id).then((response) => {
          setNameUser(response.data.name)
          setChatWorkIdUser(response.data.chatwork_id)
          setEmailUser(response.data.email)
        })
        await getAvatar(id)
          .then((res) => {
            if (!res.data) {
              setAvatarUser(null)
            } else {
              const link = `../../api/avatar/${id}`
              setAvatarUser(link)
            }
          })
          .catch(() => setAvatarUser(null))
        setLoading(false)
      } catch (error) {
        if (error.response.status === 404) {
          router.push('/404')
        }
      }
    }
  }, [user])

  return (
    <>
      <Otherlayout>
        <Otherlayout.Main>
          <h1 className="title">プロフィール</h1>
          {loading ? (
            <div className="flex flex-wrap content-center">
              <Loading loading={loading} overlay={loading} />
            </div>
          ) : (
            <div className="grid grid-cols-12 grid-rows-1 gap-2">
              <div className="row-span-1 col-span-3 justify-self-end">
                {avatarUser ? (
                  <Avatar
                    size={150}
                    style={{
                      lineHeight: '100px',
                      marginRight: '60px',
                    }}
                    src={avatarUser}
                  />
                ) : (
                  <Avatar
                    size={150}
                    style={{
                      backgroundColor: '#FFD802',
                      lineHeight: '100px',
                      marginRight: '60px',
                    }}
                    src="../images/avatars/default.jpg"
                  />
                )}
              </div>
              <div className="h-80 col-span-6 border-2 border-gray-300">
                <div className="grid grid-cols-3" style={{ marginLeft: '75%' }}>
                  <div className="col-start-3 pt-4 justify-self-center">
                    <div className="flex items-center gap-4 ">
                      <div>
                        <EditTwoTone
                          className="border-2 rounded-full py-1 px-1 border-white"
                          style={{ fontSize: '18px' }}
                          onClick={() => {
                            router.push('/profile/edit')
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-x-4 gap-y-10 text-lg pt-10">
                  <div className="col-span-3 justify-self-end">
                    <p style={{ margin: 0 }} className="font-bold">
                      ユーザー名
                      {' '}
                    </p>
                  </div>
                  <div className="col-span-6 col-start-5">
                    <p style={{ marginLeft: -50 }}>{nameUser}</p>
                  </div>

                  <div className="col-span-3 justify-self-end">
                    <p style={{ margin: 0 }} className="font-bold">
                      スラックID
                      {' '}
                    </p>
                  </div>
                  <div className="col-span-6 col-start-5">
                    <p style={{ marginLeft: -50 }}>{chatWorkIdUser}</p>
                  </div>

                  <div className="col-span-3 justify-self-end">
                    <p style={{ margin: 0 }} className="font-bold">
                      メール
                      {' '}
                    </p>
                  </div>
                  <div className="col-span-6 col-start-5">
                    <p style={{ marginLeft: -50 }}>{emailUser}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Otherlayout.Main>
      </Otherlayout>
    </>
  )
}
Profile.middleware = ['auth:superadmin', 'auth:member']
export default Profile
