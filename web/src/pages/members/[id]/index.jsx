import React, { useState, useContext, useEffect } from 'react'
import { ReactReduxContext } from 'react-redux'
import { Modal, notification } from 'antd'
import Router, { useRouter } from 'next/router'
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  CheckCircleTwoTone,
  EditTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons'
import Link from 'next/link'

import MemberDetailTable from '../../../components/member-detail-table'
import TaskControl from '../../../components/member-detail-task-control'
import Layout from '../../../layouts/OtherLayout'
import { deleteMember } from '~/api/member-detail'

function MemberDetailPage() {
  const router = useRouter()
  const idMember = router.query.id
  const [id, setID] = useState(0)
  const [role, setRole] = useState(3)
  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(null)

  const handleEdit = () => {
    Router.push(`/members/${id}/edit`)
  }

  const deletetpl = async () => {
    await deleteMember(idMember).then(() => {
      Router.push('/members')
    }).catch((error) => {
      if (error.response.status === 404) {
        router.push('/404')
      }
    })
  }

  const saveNotification = () => {
    notification.open({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      duration: 3,
      message: '正常に削除されました',
      onClick: () => {},
    })
  }

  const modelDelete = () => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: () => {
        deletetpl()
        saveNotification()
      },
      onCancel: () => {},
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }

  useEffect(() => {
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      setRole(user.get('role'))
    }
  }, [user])
  function setIdFromtable(idTable) {
    setID(idTable)
  }
  return (
    <Layout>
      <Layout.Main>
        <Link href="/members">
          <ArrowLeftOutlined className="back-button" />
        </Link>
        <div className="flex justify-between">
          <h1>メンバ詳細</h1>
          <div className="flex mt-2">
            {role === 'superadmin' ? (
              <>
                <EditTwoTone onClick={handleEdit} className="border-none mx-1 text-2xl" />

                <DeleteTwoTone onClick={modelDelete} className="border-none mx-1 text-2xl" />
              </>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col">
          <TaskControl id={id} />
          <MemberDetailTable setID={setIdFromtable} />
        </div>
      </Layout.Main>
    </Layout>
  )
}

MemberDetailPage.middleware = ['auth:superadmin', 'auth:member']
export default MemberDetailPage
