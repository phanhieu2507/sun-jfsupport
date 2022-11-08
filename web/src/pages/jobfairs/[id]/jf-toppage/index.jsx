import React, { useEffect, useState, useContext } from 'react'
import './style.scss'
import { useRouter } from 'next/router'
import { ReactReduxContext } from 'react-redux'
// import { notification } from 'antd'
// import {
//   ExclamationCircleOutlined,
//   CheckCircleTwoTone,
// } from '@ant-design/icons'
import { Card } from 'antd'
import JfLayout from '../../../../layouts/layout-task'
import ChartStatus from '../../../../components/chart-status'
import ChartMilestone from '../../../../components/chart-milestone'
import { jftask } from '../../../../api/jf-toppage'
// import SearchSugges from '../../components/search-sugges'
import Loading from '../../../../components/loading'
import RecentUpdate from '../../../../components/recentUpdate'

function jftoppage() {
  const [listTask, setlistTask] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const idJf = router.query.id
  const [user, setUser] = useState(null)
  // const [role, setRole] = useState(null)
  const { store } = useContext(ReactReduxContext)
  const fetchTasks = async () => {
    setLoading(true)
    await jftask(idJf).then((response) => {
      setlistTask(response.data.schedule.tasks)
      setLoading(false)
    }).catch((error) => {
      if (error.response?.status === 404) {
        router.push('/404')
      }
    })
    setLoading(false)
  }

  useEffect(() => {
    localStorage.setItem('id-jf', idJf)
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      // setRole(user.get('role'))
    }
    fetchTasks()
  }, [user])

  return (
    <div className="JFTopPage">
      {loading && <Loading loading={loading} overlay={loading} />}
      <JfLayout id={idJf} bgr={1}>
        <JfLayout.Main>
          <div className="container">
            <div className="flex justify-between items-start">
              {/* <div className="title w-3/5">
                <h3 className="title-h3">最近の更新</h3>
                <NotificationsJf id={idJf} />
              </div> */}
              <div className="flex flex-col w-1/2 justify-center">
                {/* <div className="cha ...  w-11/12 ml-12">
                  <SearchSugges className="h-7" listTask={listTask} id={idJf} />
                </div> */}
                <div className="justify-center ... w-11/12">
                  <Card bordered={false} className="status__global">
                    <h1>ステータス</h1>
                    <div className="status">
                      <ChartStatus task={listTask} id={idJf} />
                    </div>
                  </Card>
                  <Card bordered={false} className="justify-center ... mt-8">
                    <div className="status__global">
                      <h1>マイルストーン</h1>
                      <div className="status">
                        <ChartMilestone id={idJf} />
                      </div>
                    </div>
                  </Card>
                </div>

              </div>
              <div className="w-3/5">
                <RecentUpdate JFid={idJf} />
              </div>
            </div>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
jftoppage.middleware = ['auth:superadmin', 'auth:member']
export default jftoppage
