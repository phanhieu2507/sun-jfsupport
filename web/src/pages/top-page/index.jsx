/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react'
import { ReactReduxContext } from 'react-redux'
import router from 'next/router'
import { notification, Row, Col, Tooltip } from 'antd'
import List from '../../components/list'
import ListJfToppage from '../../components/toppage-list-jf'
import { tasks, members, jobfairs, taskReviewer } from '../../api/top-page'
import { getTaskList as getTemplateTaskList } from '../../api/template-task'
import { ListScheduleApi } from '../../api/schedule'
import Layout from '../../layouts/OtherLayout'
// import TemplateTaskSubTable from '../../components/TemplateTaskSubTable'
import TaskSubTable from '../../components/TaskSubTable'
import RecentUpdate from '../../components/recentUpdate'

const { getListSchedule } = ListScheduleApi
const truncate = (input) => (input.length > 15 ? `${input.substring(0, 15)}...` : input)

const memListDataColumn = [
  {
    title: 'メンバ名',
    dataIndex: 'name',
    key: 'name',
    width: '60%',
  },
  {
    title: 'カテゴリ',
    dataIndex: 'category',
    key: 'category',
    width: '40%',

  },
]

const jfScheduleDataColumn = [
  {
    title: 'JFスケジュール名',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
]

const templateTaskDataColumn = [
  {
    title: 'テンプレートタスク名',
    dataIndex: 'name',
    key: 'name',
    width: '40%',
  },
  {
    title: 'カテゴリ',
    dataIndex: 'category',
    key: 'category',
    render: (categoryName) => (
      <div className="">
        <Tooltip title={(categoryName.length > 0 ? categoryName.join(', ') : '')}>
          {truncate(categoryName.length > 0 ? categoryName.join(', ') : '')}
        </Tooltip>
      </div>
    ),
    width: '30%',
  },
  {
    title: 'マイルストーン',
    dataIndex: 'milestone',
    key: 'milestone',
    width: '30%',
  },
]

const taskListDataColumn = [
  {
    title: 'JF名',
    dataIndex: 'jfName',
    key: 'JF Name',
    width: '30%',
  },
  {
    title: 'タスク名',
    dataIndex: 'name',
    key: 'name',
    width: '45%',
  },
  {
    title: 'タイム',
    dataIndex: 'time',
    key: 'time',
    width: '25%',
  },
]

const Top = () => {
  const jfListDataColumn = [
    {
      title: '名前',
      dataIndex: 'name',
      key: 'key',
      width: '80%',
    },
    {
      title: 'タイム',
      dataIndex: 'time',
      key: 'key',
      width: '20%',
    },
  ]

  const [taskData, setTaskData] = useState([])
  const [taskReviewerData, setTaskReviewerData] = useState([])
  const taskReviewerList = []
  const taskDataItem = []

  const [memberData, setMemberData] = useState([])

  const [jobfairData, setJobfairData] = useState([])
  const jobfairDataItem = []
  const [role, setRole] = useState()
  const [templateData, setTemplateData] = useState([])
  const [scheduleData, setScheduleData] = useState([])

  const [isLoadingTask, setLoadingTask] = useState(false)
  const [isLoadingMember, setLoadingMember] = useState(false)
  const [isLoadingJobfair, setLoadingJobfair] = useState(false)
  const [isLoadingTemplate, setLoadingTemplate] = useState(false)
  const [isLoadingSchedule, setLoadingSchedule] = useState(false)

  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(null)
  const [id, setId] = useState(0)
  useEffect(() => {
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      setId(user.get('id'))
      setRole(user.get('role'))
    }
  }, [user])
  useEffect(() => {
    const getTask = async () => {
      setLoadingTask(true)
      const response = await tasks()
      // const tasksData = response.data.filter(
      //   (data) => data.status !== '完了' && data.status.indexOf !== '中断',
      // )
      setTaskData(response.data.filter(
        (data) => data.status !== '完了' && data.status.indexOf !== '中断',
      ))

      const data = await taskReviewer()
      setTaskReviewerData(data.data)
      setLoadingTask(false)
    }

    const getMember = async () => {
      setLoadingMember(true)
      const response = await members()
      const memberDetailList = response.data.map((member) => ({ key: member.id, name: member.name, category: member.categories.map((category) => category.category_name).join(',') }))
      setLoadingMember(false)
      setMemberData(memberDetailList)
    }
    function sortTime(item1, item2) {
      const dateA = new Date(item1.start_date).getTime()
      const dateB = new Date(item2.start_date).getTime()
      if (dateA > Date.now() && dateB > Date.now()) {
        return dateA < dateB ? 1 : -1
      }
      if (dateA < Date.now() && dateB < Date.now()) {
        return dateA > dateB ? 1 : -1
      }
      return dateA > dateB ? 1 : -1
    }
    const getJobfair = async () => {
      setLoadingJobfair(true)
      const response = await jobfairs()
      const newRes = response.data.sort(sortTime)
      setJobfairData(newRes)
      setLoadingJobfair(false)
    }

    const getTemplate = async () => {
      setLoadingTemplate(true)
      await getTemplateTaskList().then((res) => {
        const datas = []
        res.data.forEach((data) => {
          const categoryName = []
          data.categories.map(
            (category) => categoryName.push(category.category_name),
          )
          datas.push({
            key: data.id,
            name: data.name,
            category: categoryName,
            milestone: data.milestone.name,
          })
        })
        setTemplateData(datas)
        setLoadingTemplate(false)
      })
    }

    // eslint-disable-next-line func-names
    const getSchedule = async function () {
      setLoadingSchedule(true)
      let dataItem = []
      await getListSchedule().then((res) => {
        dataItem = res.data.map((data) => ({ key: data.id, name: data.name }))
      })
      setScheduleData(dataItem)
      setLoadingSchedule(false)
    }
    if (router?.query?.error === '403') {
      notification.error({
        message: 'このアカウントではアクセスできません',
        duration: 2.5,
      })
    }
    getTask()
    getMember()
    getJobfair()
    getTemplate()
    getSchedule()
  }, [])
  jobfairData.forEach((jobfair) => {
    const jobfairItem = { key: '', name: '', time: '' }
    jobfairItem.key = jobfair.id
    jobfairItem.name = jobfair.name
    jobfairItem.time = jobfair.start_date.replaceAll('-', '/')

    jobfairDataItem.push(jobfairItem)
  })
  // memberData.forEach((member) => {
  //   const memberItem = { key: '', name: '', category: '' }
  //   memberItem.key = member.id
  //   memberItem.name = member.name
  //   // const memberDetail = getMemberDetail(id).then()
  //   // memberItem.category = member.categories.map((category) => category.category_name).join(',')
  //   memberItem.category = 'ytsdfa'
  //   memberDataItem.push(memberItem)
  // })

  // memberData.forEach((member) => {
  //   const memberItem = { key: '', name: '' }
  //   memberItem.key = member.id
  //   memberItem.name = member.name

  //   memberDataItem.push(memberItem)
  // })

  taskData.forEach((task) => {
    const taskItem = { key: '', name: '', jfName: '', time: '', status: '', user_id: '', jobfair_id: '' }
    taskItem.key = task.id
    taskItem.name = task.name
    taskItem.jfName = task.jobfair.name
    taskItem.time = task.end_time
    taskItem.status = task.status
    taskItem.user_id = task.user_id
    taskItem.jobfair_id = task.jobfair.id
    taskDataItem.push(taskItem)
  })
  taskReviewerData.forEach((taskReviewerIt) => {
    const taskReviewerItem = { id: '' }
    taskReviewerItem.id = taskReviewerIt.id
    taskReviewerList.push(taskReviewerItem)
  })
  return (
    <Layout>
      <Layout.Main>
        <div>
          <div>
            <Row gutter={[50, 50]}>
              <Col span={12}>
                <ListJfToppage
                  className="my-3"
                  role={role}
                  key={1}
                  dataColumn={jfListDataColumn}
                  dataSource={jobfairDataItem}
                  text="JF"
                  searchIcon
                  showTimeInput
                  route="/jobfairs"
                  routeToAdd="/jobfairs/add"
                  isLoading={isLoadingJobfair}
                />
                {
                  role === 'superadmin' ? (
                    <>
                      <List
                        role={role}
                        key={2}
                        id={2}
                        dataColumn={memListDataColumn}
                        dataSource={memberData}
                        text="メンバ"
                        searchIcon
                        showTimeInput={false}
                        showCategoryInput={false}
                        showMilestoneInput={false}
                        route="/members"
                        routeToAdd="/members/invite"
                        isLoading={isLoadingMember}
                      />
                      <List
                        role={role}
                        key={3}
                        id={3}
                        dataColumn={jfScheduleDataColumn}
                        dataSource={scheduleData}
                        text="JFスケジュール"
                        searchIcon
                        showTimeInput={false}
                        showCategoryInput={false}
                        showMilestoneInput={false}
                        route="/schedules"
                        routeToAdd="/schedules/add"
                        isLoading={isLoadingSchedule}
                      />
                      <List
                        role={role}
                        key={4}
                        id={4}
                        dataColumn={templateTaskDataColumn}
                        dataSource={templateData}
                        text="テンプレートタスク"
                        searchIcon
                        showTimeInput={false}
                        showCategoryInput
                        showMilestoneInput
                        route="/template-tasks"
                        routeToAdd="/template-tasks/add"
                        isLoading={isLoadingTemplate}
                      />
                    </>
                  ) : null
                }

                {
                  role === 'superadmin' ? null : (
                    <TaskSubTable
                      key={5}
                      dataColumn={taskListDataColumn}
                      dataSource={taskDataItem}
                      taskReviewerList={taskReviewerList}
                      text="自分のタスク"
                      searchIcon
                      showTimeInput={false}
                      route={`members/${id}/tasks`}
                      routeToAdd="/template-tasks/add"
                      isLoading={isLoadingTask}
                    />
                  )
                }

              </Col>
              <Col span={12}>
                <RecentUpdate JFid="all" />
              </Col>
            </Row>
          </div>
        </div>
      </Layout.Main>
    </Layout>
  )
}
Top.middleware = ['auth:superadmin', 'auth:member']
export default Top
