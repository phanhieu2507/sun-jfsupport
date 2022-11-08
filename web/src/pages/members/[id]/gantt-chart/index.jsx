/* eslint-disable import/extensions */
import { Button, Empty, Radio, Input, Spin, Tooltip, DatePicker, Select } from 'antd'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DownOutlined, UpOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { unique, generateStatusColor } from '../../../../utils/utils'
import { MemberApi } from '../../../../api/member'
import { loadingIcon } from '../../../../components/loading'
import Navbar from '../../../../components/navbar'
// import JfLayout from '../../../../layouts/layout-task'
import './style.scss'

const GanttChart = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('~/components/gantt-chart/Gantt'),
  // eslint-disable-next-line comma-dangle
  { ssr: false }
)
// const chartMethod = dynamic(import('~/components/gantt-chart/Gantt'), { ssr: false })

function index() {
  const [status, setStatus] = useState('0')
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState({ data: [], links: [] })
  const router = useRouter()
  const [filter, setfilter] = useState('全て')
  const [dislayFilter, setDisplayFilter] = useState(true)
  const [optionCategory, setOptionCategory] = useState([])
  const [dateFilter, setDateFilter] = useState('')
  const [assignee, setAssignee] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [isHaveSatisfiedTask, setIsHaveSatisfiedTask] = useState(true)

  const generateJobFairNames = (resTask) => {
    const result = {}
    let i = 0
    resTask.forEach((element) => {
      if (!(element.jobfair_name in result)) i += 1
      result[element.jobfair_name] = i
    })
    return result
  }

  const generateJobFairStatus = (jobFairName, resTask) => {
    let listStatus = []

    resTask.forEach((element) => {
      if (element.jobfair_name === jobFairName) {
        listStatus.push(element.status)
      }
    })

    listStatus = unique(listStatus)

    if (listStatus.includes('進行中')) return '進行中'
    if (!listStatus.includes('未着手')) {
      if (listStatus.includes('完了')) return '完了'
      if (listStatus.includes('未完了')) return '未完了'
      return '中断'
    }
    return '未着手'
  }

  const generateTask = (resTask, member) => {
    const jobFairNames = generateJobFairNames(resTask)
    const result = { data: [] }

    Object.keys(jobFairNames).forEach((name) => {
      const jobFairStatus = generateJobFairStatus(name, resTask)
      const dataObj = {
        id: name,
        text: name,
        type: 'project',
        is_jobfair: true,
        parent: null,
        start_date: null,
        color: generateStatusColor(jobFairStatus),
        status: jobFairStatus,
        duration: null,
        progress: 0,
        row_height: 40,
        bar_height: 30,
        open: true,
      }
      result.data.push(dataObj)
    })

    if (resTask) {
      const listcategorys = []
      resTask.forEach((element) => {
        const startTime = new Date(element.start_time.replace(/\//g, '-'))
        const endTime = new Date(moment(element.end_time).endOf('day').format())
        const user = [member.name]
        const avatar = [member.id.toString()]
        const Listcategory = []
        element?.categories?.forEach((category) => {
          Listcategory.push(category.category_name)
        })
        listcategorys.push(...Listcategory)
        const dataObj = {
          id: element.id,
          text: element.name,
          assignee: user,
          avatars: avatar,
          parent: element.jobfair_name,
          start_date: startTime,
          end_date: endTime,
          color: generateStatusColor(element.status),
          status: element.status,
          row_height: 40,
          bar_height: 30,
          open: true,
          category: Listcategory,
        }
        result.data.push(dataObj)
      })
      setOptionCategory(unique(listcategorys))
    }
    return result
  }

  const generateLink = (resTask) => {
    const link = { links: [] }

    resTask.forEach((task) => {
      if (task.before_tasks) {
        task.before_tasks.forEach((element) => {
          const dummyObj = {
            id: uuidv4(),
            source: element.id,
            target: task.id,
            type: '0',
          }
          link.links.push(dummyObj)
        })
      }
      if (task.after_tasks) {
        task.after_tasks.forEach((element) => {
          const dummyObj = {
            id: uuidv4(),
            source: task.id,
            target: element.id,
            type: '1',
          }
          link.links.push(dummyObj)
        })
      }
    })
    return link
  }

  const memberID = router.query.id

  useEffect(() => {
    const fetchData = async () => {
      try {
        Promise.all([
          MemberApi.getMemberDetail(memberID),
          MemberApi.getTasksOfMember(memberID),
        ])
          .then((responses) => {
            const member = responses[0].data.user
            setAssignee(member.name)
            /* task from old response => don't touch  */
            const resTask = Array.from(responses[1].data)
            const data = generateTask(resTask, member)
            const links = generateLink(resTask)
            setTasks({ ...data, ...links })
            setLoading(false)
            return resTask
          })
          .catch((error) => {
            setLoading(false)
            if (error.response?.status === 404) {
              router.push('/404')
            }
          })
        return []
      } catch (error) {
        setLoading(false)
        if (error.response?.status === 404) {
          router.push('/404')
        }
        return error
      }
    }
    fetchData()
  }, [])

  const onStatusChange = (e) => {
    const cases = e.target.value * 1
    switch (cases) {
      case 0:
        setfilter('全て')
        break
      case 1:
        setfilter('未着手')
        break
      case 2:
        setfilter('進行中')
        break
      case 3:
        setfilter('完了')
        break
      case 4:
        setfilter('中断')
        break
      case 5:
        setfilter('未完了')
        break

      default:
        setfilter('全て')
        break
    }

    setStatus(e.target.value)
  }
  const scrollToToday = async () => {
    // eslint-disable-next-line import/no-unresolved
    const method = await import('~/components/gantt-chart/Gantt')
    method?.scrollToToday()
    return []
  }
  const handleShowFilter = () => {
    setDisplayFilter(!dislayFilter)
  }
  const onChangeStartDate = (date, dateString) => {
    setDateFilter(dateString)
  }
  const handlSelectCategory = (value) => {
    setCategoryFilter(value)
  }
  const onSearch = (e) => {
    setNameFilter(e.target.value)
  }
  return (
    <>
      <Navbar />
      <div className="gantt-chart-page">
        <div className="mx-auto flex-1 justify-center px-4">
          <Link href={`/members/${memberID}`}>
            <ArrowLeftOutlined className="back-button" />
          </Link>
          {/* page title */}
          <div className="ant-row w-full">
            <div className="w-full flex justify-between">
              <h1 className="">メンバのガントチャート</h1>
            </div>
          </div>
          {
            dislayFilter ? (
              <div className="mb-6">
                <DownOutlined onClick={handleShowFilter} style={{ fontSize: '30px' }} />
                <div className="list_filter">
                  <div className="col-span-12 mb-3">
                    <div className="flex justify-between">
                      <div className="flex">
                        <div className="flex items-center">
                          <span style={{ fontWeight: '600' }} className="mr-2">開始日:</span>
                          <DatePicker size="large" onChange={onChangeStartDate} />
                        </div>
                        <div className="ml-3">
                          <Button
                            type="primary"
                            onClick={loading ? '' : scrollToToday}
                            style={{ letterSpacing: '-3px' }}
                          >
                    今日
                          </Button>
                        </div>

                      </div>
                      <div>
                        <Input
                          className="no-border mr-3"
                          width="300"
                          allowClear="true"
                          prefix={<SearchOutlined />}
                          placeholder="タスク名"
                          onChange={onSearch}
                          value={nameFilter}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="flex justify-between">
                      <div className="flex">
                        <div className="flex items-center">
                          <span style={{ fontWeight: '600' }} className="mr-2">カテゴリ:</span>
                          <Select
                            size="large"
                            placeholder="カテゴリ"
                            style={{ width: '210px' }}
                            allowClear="true"
                            onChange={handlSelectCategory}
                          >
                            {optionCategory.map((element) => (
                              <Select.Option key={element} value={element}>
                                {element}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>

                      </div>
                      <Radio.Group
                        disabled={loading}
                        onChange={onStatusChange}
                        defaultValue={status}
                        buttonStyle="solid"
                        className="flex items-center flex-row"
                      >
                        <Tooltip placement="topLeft" title="全て">
                          <Radio.Button
                            className=" radio-button p-0 text-center ml-1"
                            value="0"
                          >
                      全て
                          </Radio.Button>
                        </Tooltip>
                        <Tooltip placement="topLeft" title="未着手">
                          <Radio.Button
                            className="radio-button p-0 text-center ml-1"
                            value="1"
                          >
                      未着手
                          </Radio.Button>
                        </Tooltip>
                        <Tooltip placement="topLeft" title="進行中">
                          <Radio.Button
                            className="radio-button w-10 p-0 text-center ml-1"
                            value="2"
                          >
                      進行中
                          </Radio.Button>
                        </Tooltip>
                        <Tooltip placement="topLeft" title="完了">
                          <Radio.Button
                            className="radio-button p-0 text-center ml-1"
                            value="3"
                          >
                      完了
                          </Radio.Button>
                        </Tooltip>
                        <Tooltip placement="topLeft" title="中断">
                          <Radio.Button
                            className="radio-button p-0 text-center ml-1"
                            value="4"
                          >
                      中断
                          </Radio.Button>
                        </Tooltip>
                        <Tooltip placement="topLeft" title="未完了">
                          <Radio.Button
                            className="radio-button p-0 text-center ml-1"
                            value="5"
                          >
                      未完了
                          </Radio.Button>
                        </Tooltip>
                      </Radio.Group>
                    </div>
                  </div>
                </div>
              </div>
            )
              : <UpOutlined className="mb-6" onClick={handleShowFilter} style={{ fontSize: '30px' }} />
          }

          <div className="gantt-chart">
            <div>
              <div className="container xl ">
                <div className="h-full">
                  {!isHaveSatisfiedTask && (
                    <div className="flex items-center justify-center">
                      <Empty
                        className="relative border w-full h-3/4 py-10 mx-10 border-solid rounded-sm "
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="データがありません"
                      >
                        <Spin
                          style={{ color: '#ffd803' }}
                          spinning={loading}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          indicator={loadingIcon}
                          size="large"
                        />
                      </Empty>
                    </div>
                  )}
                  {tasks.data.length && (
                    <div
                      style={{
                        height: '670px',
                        visibility: isHaveSatisfiedTask ? 'visible' : 'hidden',
                      }}
                    >
                      <p className="hidden">{Boolean(tasks.data.length).toString()}</p>

                      <GanttChart
                        className="hidden"
                        tasks={tasks}
                        filter={filter}
                        dateFilter={dateFilter}
                        nameFilter={nameFilter}
                        categoryFilter={categoryFilter}
                        assigneeFilter={assignee}
                        setIsHaveSatisfiedTask={setIsHaveSatisfiedTask}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

index.middleware = ['auth:superadmin', 'auth:member']
export default index
