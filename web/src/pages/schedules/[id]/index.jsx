import React, { useEffect, useState, useContext } from 'react'
// import Swiper core and required modules
import { Modal, notification, Spin } from 'antd'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ReactReduxContext } from 'react-redux'
import { RightCircleOutlined, EditTwoTone, DeleteTwoTone, ArrowLeftOutlined } from '@ant-design/icons'
import { getSchedule, deleteSchedule } from '../../../api/schedule-detail'
import ScheduleDetail from './list'
import Navbar from '../../../components/navbar/index'
import GanttChart from './gantt'

function ScheduleDetailGeneral() {
  const [status, setStatus] = useState(false) // false is lsit,true is gantt
  const [id, setID] = useState(0) // get ID
  const [scheduleName, setScheduleName] = useState('')
  const [role, setRole] = useState('member') // get Role
  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(null) // get User
  const router = useRouter() // router
  const [isModalVisible, setIsModalVisible] = useState(false) // state of Modal
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    // get ID
    setID(router.query.id)
    getSchedule(router.query.id).then((res) => {
      setScheduleName(res.data.name)
    }).catch((error) => {
      if (error.response.status === 404) {
        router.push('/404')
      }
    })
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      setRole(user.get('role'))
    }
    // alert(role);
  }, [user])
  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)

    deleteSchedule(id)
      .then(() => {
        router.push('/schedules')
        notification.success({
          message: '成功',
          description: '正常に削除されました',
          duration: 3,
        })
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
        notification.error({
          message: '失敗',
          description: '削除に失敗しました',
          duration: 3,
        })
      })
  }
  const changeScreen = () => {
    setLoading(true)
    setTimeout(() => {
      setStatus(!status)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="app overflow-hidden">
      <header>
        <Navbar />
      </header>
      <div className="px-12">
        <div className="flex items-center" style={{ justifyContent: 'space-between' }}>
          <Link href="/schedules">
            <ArrowLeftOutlined className="back-button" />
          </Link>
          <h1 className="mt-10 text-3xl font-bold" style={{ color: '#272343' }}>
            {scheduleName}
          </h1>
          <div
            className="flex justify-end"
            style={{ visibility: role === 'superadmin' ? 'visible' : 'hidden' }}
          >
            <Link href={`/schedules/${id}/edit`}>
              <EditTwoTone className="border-none mx-1 text-2xl" />
            </Link>
            <DeleteTwoTone onClick={showModal} className="border-none mx-1 text-2xl" />
            <Modal
              title="削除"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={() => setIsModalVisible(false)}
              closable={false}
            >
              <p>削除してもよろしいですか？</p>
            </Modal>
          </div>
        </div>

        <Spin spinning={loading}>
          <div className="mt-12 relative">
            {status ? <GanttChart id={id} /> : <ScheduleDetail />}
            <span className="mb-12 ml-2">
              <RightCircleOutlined
                className="text-4xl gantt-chart inline cursor-pointer absolute bottom-1/2"
                style={{ right: '-2.25rem', marginBottom: !status ? '0' : '-4%' }}
                onClick={changeScreen}
              />
            </span>
          </div>
        </Spin>
      </div>
    </div>
  )
}
ScheduleDetailGeneral.middleware = ['auth:superadmin', 'auth:member']
export default ScheduleDetailGeneral
