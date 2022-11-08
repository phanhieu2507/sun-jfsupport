/* eslint-disable import/extensions */
import { Button, Empty, Radio, Input, Spin, Tooltip, DatePicker, Select, Popover } from 'antd'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DownOutlined, UpOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons'
import ganttChartAPI from '../../../../api/gantt-chart'
import { loadingIcon } from '../../../../components/loading'
import JfLayout from '../../../../layouts/layout-task'
import './style.scss'
import { unique, generateStatusColor } from '../../../../utils/utils'

const GanttChart = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('../../../../components/gantt-chart/Gantt'),
  // eslint-disable-next-line comma-dangle
  { ssr: false }
)

function index() {
  const [status, setStatus] = useState('0')
  const [loading, setLoading] = useState(true)
  const [tasks, setTask] = useState({ data: [], links: [] })
  const router = useRouter()
  const [filter, setfilter] = useState('全て')
  const [dislayFilter, setDisplayFilter] = useState(true)
  const [jobfairStartDate, setJobfairStartDate] = useState(new Date())
  const [optionAssignee, setOptionAssignee] = useState([])
  const [optionCategory, setOptionCategory] = useState([])
  const [dateFilter, setDateFilter] = useState('')
  const [assigneeFilter, setAssigneeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [filterVisible, setFilterVisible] = useState(false)
  const [isHaveSatisfiedTask, setIsHaveSatisfiedTask] = useState(true)

  const generateTask = (resTask) => {
    const result = { data: [] }
    if (resTask) {
      const listAllUsers = []
      const listcategorys = []
      resTask.forEach((element) => {
        const startTime = new Date(element.start_time.replace(/\//g, '-'))
        const endTime = new Date(moment(element.end_time).endOf('day').format())
        const user = []
        const avatar = []
        const Listcategory = []
        element?.users?.forEach((item) => {
          user.push(item.name)
          avatar.push(item.id.toString())
        })
        listAllUsers.push(...user)
        element?.categories?.forEach((category) => {
          Listcategory.push(category.category_name)
        })
        listcategorys.push(...Listcategory)
        const dataObj = {
          type: element.parent_id ? 'project' : '',
          id: element.id,
          text: element.name,
          assignee: user,
          avatars: avatar,
          parent: element.parent_id ? element.parent_id : '',
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
      setOptionAssignee(unique(listAllUsers))
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

  const jobfairID = router.query.id

  useEffect(() => {
    const fetchData = async () => {
      try {
        Promise.all([
          ganttChartAPI.getJobfair(jobfairID),
          ganttChartAPI.getTasks(jobfairID),
          ganttChartAPI.getGanttTasks(jobfairID),
        ])
          .then((responses) => {
            const jobfair = responses[0].data
            /* task from old response => don't touch  */
            const oldTaskRes = Array.from(responses[1].data.schedule.tasks)
            // resTask = responses task
            const resTask = responses[2].data
            const links = generateLink(resTask)
            const data = generateTask(oldTaskRes)
            setTask({ ...data, ...links })
            setJobfairStartDate(new Date(jobfair.start_date))
            setLoading(false)
            return oldTaskRes
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
        if (error.response.status === 404) {
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
    const method = await import('../../../../components/gantt-chart/Gantt')
    method?.scrollToToday()
    return []
  }

  const handleShowFilter = () => {
    setDisplayFilter(!dislayFilter)
  }

  const onChangeStartDate = (date, dateString) => {
    setDateFilter(dateString)
  }

  const handlSelectAssignee = (value) => {
    setAssigneeFilter(value)
  }

  const handlSelectCategory = (value) => {
    setCategoryFilter(value)
  }

  const onSearch = (e) => {
    setNameFilter(e.target.value)
  }

  return (
    <JfLayout id={jobfairID} bgr={3}>
      <JfLayout.Main>
        <div className="gantt-chart-page">
          <div className="mx-auto flex-1 justify-center px-4">
            {/* page title */}
            <div className="ant-row w-full">
              <div className="w-full flex justify-between">
                <h1 className="">ガントチャート</h1>
                <Button
                  type="primary"
                  className="tracking-tighter"
                  onClick={() => {
                    router.push('/jobfairs')
                  }}
                >
                  JF一覧
                </Button>
              </div>
            </div>
            {
              dislayFilter ? (
                <div className="mb-6">
                  <DownOutlined onClick={handleShowFilter} style={{ fontSize: '30px' }} />
                  <div className="list_filter">
                    <div className="col-span-12 mb-3 mt-3">
                      <div className="flex justify-between">
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

                        <div className="flex">
                          <div className="ml-3">
                            <Button
                              type="primary"
                              onClick={loading ? '' : scrollToToday}
                              style={{ letterSpacing: '-3px' }}
                            >
                              今日
                            </Button>
                          </div>

                          <Popover
                            content={(
                              <>
                                <h6 style={{ fontWeight: '700' }} className="mr-2 mb-1">開始日:</h6>
                                <DatePicker
                                  className="mb-1"
                                  size="large"
                                  style={{ width: '300px' }}
                                  onChange={onChangeStartDate}
                                />

                                <h6 style={{ fontWeight: '700' }} className="mr-2 mb-1">担当者:</h6>
                                <Select
                                  className="mb-1"
                                  size="large"
                                  placeholder="担当者"
                                  style={{ width: '300px' }}
                                  allowClear="true"
                                  onChange={handlSelectAssignee}
                                >
                                  {optionAssignee.map((element) => (
                                    <Select.Option key={element} value={element}>
                                      {element}
                                    </Select.Option>
                                  ))}
                                </Select>

                                <h6 style={{ fontWeight: '700' }} className="mr-2 mb-1">カテゴリ:</h6>
                                <Select
                                  className="mb-1"
                                  size="large"
                                  placeholder="カテゴリ"
                                  style={{ width: '300px' }}
                                  allowClear="true"
                                  onChange={handlSelectCategory}
                                >
                                  {optionCategory.map((element) => (
                                    <Select.Option key={element} value={element}>
                                      {element}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </>
                            )}
                            className="mr-2 ml-2"
                            placement="bottomLeft"
                            trigger="click"
                            visible={filterVisible}
                            onVisibleChange={() => setFilterVisible(!filterVisible)}
                          >
                            {dateFilter || assigneeFilter || categoryFilter || filterVisible ? (
                              <Button
                                size="large"
                                shape="circle"
                                style={{ background: '#ffd803' }}
                                icon={<FilterOutlined id="filter" />}
                              />
                            ) : (
                              <Button size="large" shape="circle" icon={<FilterOutlined id="filter" />} />
                            )}
                          </Popover>

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
                          tasks={tasks}
                          jobfairStartDate={jobfairStartDate}
                          filter={filter}
                          dateFilter={dateFilter}
                          nameFilter={nameFilter}
                          categoryFilter={categoryFilter}
                          assigneeFilter={assigneeFilter}
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
      </JfLayout.Main>
    </JfLayout>
  )
}

index.middleware = ['auth:superadmin', 'auth:member']
export default index
