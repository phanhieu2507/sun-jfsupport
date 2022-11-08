/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React, { useEffect, useState, useContext } from 'react'
import {
  Table,
  Input,
  Modal,
  Popover,
  Empty,
  Select,
  Tooltip,
  Button,
  Space,
  notification,
  Radio,
  Badge,
} from 'antd'
import './style.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  SearchOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import JfLayout from '../../../../layouts/layout-task'
import { getCategories } from '../../../../api/template-task'
import { getAllMileStone } from '../../../../api/milestone'
import { listTaskWithParent } from '../../../../api/jf-toppage'
import { deleteTask } from '../../../../api/task-detail'
import { loadingIcon } from '../../../../components/loading'
import EditUserAssignee from '../../../../components/EditUserAssignee'
import * as taskStatus from '../../../../shared/constants/taskStatus'
import * as taskStatusColor from '../../../../shared/constants/taskColorByStatus'

function TaskList() {
  const router = useRouter()
  const JFId = router.query.id
  const { store } = useContext(ReactReduxContext)
  const [role, setRole] = useState('')
  const [itemCount, setItemCount] = useState(10)
  const [pagination, setPagination] = useState({
    position: ['bottomCenter'],
    showTitle: false,
    showSizeChanger: false,
    pageSize: 10,
  })
  const [isFilterCA, setIsFilterCA] = useState(false)
  const [isFilterMI, setIsFilterMI] = useState(false)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [originalData, setOriginalData] = useState([])
  const [temperaryData, setTemperaryData] = useState([])
  const [companies, setCompanies] = useState(new Map())
  const [optionMilestone, setOptionMileStone] = useState([])
  const [optionCategory, setOptionCategory] = useState([])
  const [statusFilter, setStatusFilter] = useState('全て')
  const [valueSearch, setValueSearch] = useState(router.query.name)
  const { Option } = Select
  const [category, setCategory] = useState('')
  const [milestone, setMilestone] = useState('')
  const [rowEdit, setRowEdit] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [parentId, setParentId] = useState([])
  const [isRowCheck, setIsRowCheck] = useState(false)
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false)
  const [selectedData, setSelectedData] = useState([])
  // select number to display
  const handleSelect = (value) => {
    setPagination((preState) => ({
      ...preState,
      pageSize: value,
    }))
    setItemCount(value)
    localStorage.setItem('pagination', JSON.stringify({ ...pagination, pageSize: value }))
  }
  const handleVisibleChange = () => {
    setVisible(!visible)
  }
  const initPagination = () => {
    const paginationData = JSON.parse(localStorage.getItem('pagination'))
    if (paginationData === null) {
      localStorage.setItem('pagination', JSON.stringify(pagination))
    } else {
      setPagination((preState) => ({
        ...preState,
        pageSize: paginationData.pageSize,
      }))
      setItemCount(paginationData.pageSize)
    }
  }
  // add data of table
  const loadTableData = (response) => {
    setCompanies(new Map(response.data.companies.map((company) => [company.id, company.company_name])))

    const dataResponse = response ? response.data.schedule.tasks : null
    const data = []
    for (let i = 0; i < dataResponse.length; i += 1) {
      const manager = []
      const mem = []
      const categoryName = []
      const categoryId = []
      for (let j = 0; j < dataResponse[i].categories.length; j += 1) {
        categoryName.push(dataResponse[i].categories[j].category_name)
        categoryId.push(dataResponse[i].categories[j].id)
      }
      for (let j = 0; j < dataResponse[i].users.length; j += 1) {
        manager.push(dataResponse[i].users[j].name)
        mem.push({
          id: dataResponse[i].users[j].id,
          name: dataResponse[i].users[j].name,
        })
      }
      let info = {
        key: dataResponse[i].id,
        idtask: dataResponse[i].id,
        taskName: dataResponse[i].name,
        start_date: dataResponse[i].start_time,
        end_date: dataResponse[i].end_time,
        status: dataResponse[i].status,
        category_name: categoryName,
        milestone_name: dataResponse[i]?.milestone.name,
        managers: manager,
        mems: mem,
        idCategory: categoryId,
        parent_id: dataResponse[i]?.parent_id,
        is_parent: dataResponse[i]?.is_parent,
        company_id: dataResponse[i]?.company_id,
      }
      if ('children' in dataResponse[i]) {
        const children = []
        dataResponse[i].children.forEach((child) => {
          const childManager = []
          const member = []
          const childCategoryName = []
          const childCategoryId = []
          for (let j = 0; j < child.categories.length; j += 1) {
            childCategoryName.push(child.categories[j].category_name)
            childCategoryId.push(child.categories[j].id)
          }
          for (let j = 0; j < child.users.length; j += 1) {
            childManager.push(child.users[j].name)
            member.push({
              id: child.users[j].id,
              name: child.users[j].name,
            })
          }
          const childInfo = {
            key: child.id,
            idtask: child.id,
            taskName: child.name,
            start_date: child.start_time,
            end_date: child.end_time,
            status: child.status,
            category_name: childCategoryName,
            milestone_name: child?.milestone.name,
            managers: childManager,
            mems: member,
            idCategory: childCategoryId,
            parent_id: child?.parent_id,
            is_parent: child?.is_parent,
            company_id: child?.company_id,
          }
          children.push(childInfo)
        })
        info = { ...info, children }
      }
      data.push(info)
    }
    setTemperaryData(data)
    setOriginalData(data)
    const tmpParentID = []
    data.map((item) => {
      tmpParentID.push(item.key)
      return item
    })
    setParentId(tmpParentID)
    let filteredData = [...data]
    if (valueSearch) {
      const taskNameParameter = router.query.name.toLowerCase()
      filteredData = data.filter((task) => task.taskName.toLowerCase().includes(taskNameParameter))
      setTemperaryData(filteredData)
    }

    if (router.query.status) {
      filteredData = data.filter((task) => !task.status.localeCompare(router.query.status))
      setStatusFilter(router.query.status)
      setTemperaryData(filteredData)
    }
  }

  const loadCategoryOptions = (response) => {
    const option = []
    option.push(<Option key={0} value={0}>全て</Option>)
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option value={response.data[i].category_name}>{response.data[i].category_name}</Option>,
      )
    }
    setOptionCategory(option)
  }

  const loadMilestoneOptions = (response) => {
    const option = []
    option.push(<Option value={0}>全て</Option>)
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(<Option value={response.data[i].name}>{response.data[i].name}</Option>)
    }
    setOptionMileStone(option)
  }

  const saveNotification = () => {
    notification.success({
      duration: 3,
      message: '正常に削除されました',
      onClick: () => { },
    })
  }
  const deletetpl = async (id) => {
    setLoading(true)
    try {
      await deleteTask(id).then((res) => {
        const deletedTask = res.data.deleted_task
        if (deletedTask.parent_id === null && deletedTask.is_parent !== 1) {
          const newList = originalData.filter((item) => item.idtask !== id)
          setTemperaryData(newList)
          setOriginalData(newList)
          saveNotification()
        } else if (deletedTask.is_parent === 1) {
          let newList = originalData.filter((item) => item.idtask !== id)
          const newTask = originalData.find((el) => el.key === deletedTask.id)
            .children.map((el) => ({ ...el, parent_id: null }))
          newList = [...newList, ...newTask]
          setTemperaryData(newList)
          setOriginalData(newList)
          saveNotification()
        } else {
          const newList = originalData.map((item) => {
            if (item.key === deletedTask.parent_id) {
              item.children = item.children.filter((element) => element.idtask !== id)
            }
            return item
          })
          setTemperaryData(newList)
          setOriginalData(newList)
          saveNotification()
        }
      })
    } catch (error) {
      if (error.response?.status === 404) {
        router.push('/404')
      } else Error(error.toString())
    }

    setLoading(false)
  }
  const modelDelete = (id) => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: async () => {
        deletetpl(id)
      },
      onCancel: () => { },
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }

  const handleEdit = (id) => {
    router.push(`/jobfairs/${JFId}/tasks/${id}/edit`)
  }
  const handleSelectCategory = (value) => {
    setCategory(value)
  }

  const handleSelectMilestone = (value) => {
    setMilestone(value)
  }

  const handleRow = (record) => ({
    onClick: () => {
      router.push(`/jobfairs/${JFId}/tasks/${record.idtask}`)
    },
  })

  const renderBadgeByStatus = (status) => {
    switch (status) {
      case taskStatus.NEW:
        return <Badge color={taskStatusColor.NEW} />
      case taskStatus.IN_PROGRESS:
        return <Badge color={taskStatusColor.IN_PROGRESS} />
      case taskStatus.DONE:
        return <Badge color={taskStatusColor.DONE} />
      case taskStatus.PENDING:
        return <Badge color={taskStatusColor.PENDING} />
      case taskStatus.BREAK:
        return <Badge color={taskStatusColor.BREAK} />
      default:
        return <Badge color={taskStatusColor.NEW} />
    }
  }

  const isRowChecked = (selectedRowKeys, selectedRows) => {
    const selectedInfo = selectedRows.map(
      (row) => ({
        key: row.key,
        selectedTaskName: row.taskName,
        selectedCategory: row.category_name,
        is_parent: row.is_parent,
        idCategory: row.idCategory,
        children: row.children,
      }),
    )

    setSelectedData(selectedInfo)
    if (selectedRows.length) {
      setIsRowCheck(true)
    } else {
      setIsRowCheck(false)
    }
  }
  const openAssignModalHandler = () => {
    setIsAssignModalVisible(true)
  }

  // columns of tables
  const columns = role === 'admin'
    ? [
      {
        title: 'タスク名',
        width: '30%',
        dataIndex: 'taskName',
        fixed: 'left',
        render: (taskName, record) => (
          <>
            <div className={parentId.includes(record.key) ? 'task-name' : 'task-children'}>
              <Tooltip title={taskName}>
                <Link href={`/jobfairs/${JFId}/tasks/${record.idtask}`}>
                  <>
                    {renderBadgeByStatus(record.status)}
                    {taskName}
                  </>
                </Link>
              </Tooltip>
            </div>
            <div className={parentId.includes(record.key) ? 'company-name' : 'company-name__children'}>
              {companies.get(record.company_id) ? companies.get(record.company_id) : ''}
            </div>
          </>
        ),
        onCell: handleRow,
      },
      {
        title: 'マイルストーン',
        dataIndex: 'milestone_name',
        width: '15%',
        render: (milestone, record) => (
          <Link href={`/jobfairs/${JFId}/tasks/${record.idtask}`}>
            <a>{milestone}</a>
          </Link>
        ),
        onCell: handleRow,
      },
      {
        title: '時間',
        width: '10%',
        dataIndex: 'start_date',
        render: (text, record) => (
          <Link href={`/jobfairs/${JFId}/tasks/${record.idtask}`}>
            <a>{`${record.start_date} ${record.end_date}`}</a>
          </Link>
        ),
        onCell: handleRow,
      },
      {
        title: 'カテゴリ',
        width: '15%',
        dataIndex: 'category_name',
        render: (categoryName) => (
          <div className="">
            {
              categoryName.length > 0 ? (
                <>
                  <div>
                    {
                      categoryName.map((item) => {
                        if (item === categoryName[categoryName.length - 1]) {
                          return (
                            <span className="">
                              <span>{item}</span>
                            </span>
                          )
                        }
                        return (
                          <>
                            <span style={{ paddingRight: '3px' }}>
                              {item}
                              <hr />
                            </span>
                          </>
                        )
                      })
                    }
                  </div>
                </>
              ) : ('')
            }
          </div>
        ),
        onCell: handleRow,
      },
      {
        title: '担当者',
        width: '30%',
        dataIndex: 'managers',
        fixed: 'left',
        render: (managers, record) => {
          if (record.is_parent !== 1) {
            if (rowEdit === record.key) {
              return (
                <EditUserAssignee
                  setIsEdit={setIsEdit}
                  setRowEdit={setRowEdit}
                  record={record}
                  loadTableData={loadTableData}
                  setLoading={setLoading}
                />
              )
            }

            return (
              <div
                onClick={() => {
                  if (rowEdit && isEdit) {
                    Modal.confirm({
                      title: '変更内容が保存されません。よろしいですか？',
                      icon: <ExclamationCircleOutlined />,
                      content: '',
                      centered: true,
                      okText: 'はい',
                      cancelText: 'いいえ',
                      onOk: () => {
                        setRowEdit(record.key)
                        setIsEdit(false)
                      },
                    })
                  } else {
                    setRowEdit(record.key)
                  }
                }}
                className="task-managers"
              >
                { // eslint-disable-next-line consistent-return
                  managers.length > 0 ? (
                    <>
                      <ul className="ml-5">
                        {
                          managers.map((item) => {
                            if (item === managers[managers.length - 1]) {
                              return (
                                <li className="mb-1">
                                  {item}
                                </li>
                              )
                            }
                            return (
                              <>
                                <li className="mb-1">
                                  {item}
                                </li>
                              </>
                            )
                          })
                        }
                      </ul>
                      <EditTwoTone className="ml-1" />
                    </>
                  ) : (
                    <>
                      <div className="">
                        <span style={{ color: '#999' }} className="ml-1">
                          担当者を選択してください
                        </span>
                      </div>
                      <EditTwoTone className="ml-1" />
                    </>
                  )
                }
              </div>
            )
          }
          return ''
        },
      },
      {
        key: 'action',
        width: '5%',
        fixed: 'left',
        render: (_text, record) => role === 'admin' && record.is_parent !== 1 && (
          <Space size="small">
            <EditTwoTone
              id={record.key}
              onClick={() => {
                handleEdit(record.idtask)
              }}
            />

            <DeleteTwoTone
              id={record.key}
              onClick={() => {
                modelDelete(record.idtask)
              }}
            />
          </Space>
        ),
      },
    ]
    : [
      {
        title: 'タスク名',
        width: '30%',
        dataIndex: 'taskName',
        fixed: 'left',
        render: (taskName, record) => (
          <>
            <div className={parentId.includes(record.key) ? 'task-name' : 'task-children'}>
              <Tooltip title={taskName}>
                <Link href={`/jobfairs/${JFId}/tasks/${record.idtask}`}>
                  <>
                    {renderBadgeByStatus(record.status)}
                    {taskName}
                  </>
                </Link>
              </Tooltip>
            </div>
            <div className={parentId.includes(record.key) ? 'company-name' : 'company-name__children'}>
              {companies.get(record.company_id) ? companies.get(record.company_id) : ''}
            </div>
          </>
        ),
        onCell: handleRow,
      },
      {
        title: 'マイルストーン',
        dataIndex: 'milestone_name',
        width: '15%',
        fixed: 'left',
        render: (milestone, record) => (
          <Link href={`/jobfairs/${JFId}/tasks/${record.idtask}`}>
            <a>{milestone}</a>
          </Link>
        ),
        onCell: handleRow,
      },
      {
        title: '時間',
        width: '10%',
        dataIndex: 'start_date',
        fixed: 'left',
        render: (text, record) => (
          <Link href={`/jobfairs/${JFId}/tasks/${record.idtask}`}>
            <a>{`${record.start_date} ${record.end_date}`}</a>
          </Link>
        ),
        onCell: handleRow,
      },
      {
        title: 'カテゴリ',
        width: '15%',
        dataIndex: 'category_name',
        fixed: 'left',
        render: (categoryName) => (
          <div className="">
            {
              categoryName.length > 0 ? (
                <>
                  <div>
                    {
                      categoryName.map((item) => {
                        if (item === categoryName[categoryName.length - 1]) {
                          return (
                            <span className="">
                              {item}
                            </span>
                          )
                        }
                        return (
                          <>
                            <span style={{ paddingRight: '3px' }}>
                              {item}
                              <hr />
                            </span>
                          </>
                        )
                      })
                    }
                  </div>
                </>
              ) : ('')
            }
          </div>
        ),
        onCell: handleRow,
      },
      {
        title: '担当者',
        width: '30%',
        dataIndex: 'managers',
        fixed: 'left',
        onCell: handleRow,
        render: (managers) => (
          <div className="task-managers">
            {
              managers.length > 0 ? (
                <>
                  <ul className="ml-5">
                    {
                      managers.map((item) => {
                        if (item === managers[managers.length - 1]) {
                          return (
                            <li className="mb-1">
                              {item}
                            </li>
                          )
                        }
                        return (
                          <>
                            <li className="mb-1">
                              {item}
                            </li>
                          </>
                        )
                      })
                    }
                  </ul>
                </>
              ) : (
                <div className="flex items-center">
                  <span style={{ color: '#999' }} className="ml-1">
                    担当者なし
                  </span>
                </div>
              )
            }
          </div>
        ),
      },
    ]

  const modalColumns = [
    {
      title: 'タスク名',
      width: '35%',
      dataIndex: 'selectedTaskName',
      align: 'left',
      render: (taskName, record) => (
        <>
          <div className="task-name">
            <Tooltip title={taskName}>
              <div className="inline">
                <Space size="middle">
                  <Link href={`/jobfairs/${JFId}/tasks/${record.idtask}`}>
                    <a className={parentId.includes(record.key) ? '' : 'task-children'}>{taskName}</a>
                  </Link>
                  <DeleteTwoTone
                    id={record.key}
                    style={{ right: 0 }}
                    onClick={() => {
                      setSelectedData((prev) => {
                        if (record.is_parent === 1) {
                          const newList = prev.filter(
                            (task) => task.key !== record.key && !record.children.map(
                              (item) => item.key,
                            ).includes(task.key),
                          )
                          return newList
                        }
                        return prev.filter((task) => task.key !== record.key)
                      })
                    }}
                  />
                </Space>
              </div>
            </Tooltip>
          </div>
          <div className={parentId.includes(record.key) ? 'company-name' : 'company-name-children'}>
            {companies.get(record.id) ? companies.get(record.id) : ''}
          </div>
        </>
      ),
    },
    {
      title: 'カテゴリ',
      width: '25%',
      dataIndex: 'selectedCategory',
      align: 'center',
      onCell: handleRow,
      render: (categoryName) => (
        <div className="">
          {categoryName.length > 0 ? categoryName.join(', ') : ''}
        </div>
      ),
    },
    {
      title: '新担当者追加',
      width: '40%',
      align: 'center',
      dataIndex: 'hintManagers',
      render: () => (
        <Select size="large" style={{ width: 300 }} mode="multiple">
          {['Vu Thanh Huong', 'Vu Hai Ngan'].map((manager) => <Option value={manager}>{manager}</Option>)}
        </Select>
      ),
    },
  ]

  const getRole = () => {
    const id = router.query.id
    const user = store.getState().get('auth').get('user')
    const manageIds = Array.from(user.get('manage_jf_ids'))
    if (manageIds.includes(parseInt(id, 10))) {
      setRole('admin')
    } else {
      setRole(user.get('role'))
    }
  }

  useEffect(async () => {
    setLoading(true)
    getRole()
    initPagination()
    try {
      await listTaskWithParent(router.query.id).then((response) => {
        loadTableData(response)
      })
      await getCategories().then((response) => {
        loadCategoryOptions(response)
      })
      await getAllMileStone().then((response) => {
        loadMilestoneOptions(response)
      })
    } catch (error) {
      if (error.response?.status === 404) {
        router.push('/404')
      }
    }
    setLoading(false)
  }, [role])

  const onSearch = (e) => {
    const currValue = e.target.value
    setValueSearch(currValue)
  }

  const onStatusFilterChange = (e) => {
    const cases = e.target.value * 1

    switch (cases) {
      case 0:
        setStatusFilter('全て')
        break
      case 1:
        setStatusFilter('未着手')
        break
      case 2:
        setStatusFilter('進行中')
        break
      case 3:
        setStatusFilter('完了')
        break
      case 4:
        setStatusFilter('中断')
        break
      case 5:
        setStatusFilter('未完了')
        break

      default:
        setStatusFilter('全て')
        break
    }
  }

  const filterChildrenWithSearchValue = (task, value) => {
    task.children = task.children.filter(
      (child) => child.managers.some(
        (manager) => manager.toLowerCase().includes(value),
      ) || child.taskName.includes(value),
    )
    return (task.children.length > 0)
  }

  useEffect(() => {
    if (originalData.length > 0) {
      let filteredData = JSON.parse(JSON.stringify(originalData))
      if (statusFilter !== '全て') {
        filteredData = filteredData.filter(
          (task) => (statusFilter ? !task.status.localeCompare(statusFilter) : task.status),
        )
      }
      if (valueSearch) {
        const value = valueSearch.toLowerCase()
        filteredData = filteredData.filter(
          (task) => (value
            ? task.taskName.toLowerCase().includes(value)
            || (task.is_parent
              ? filterChildrenWithSearchValue(task, value)
              : task.managers.some((manager) => manager.toLowerCase().includes(value)))
            : task.taskName),
        )
      }
      if (milestone) {
        setIsFilterMI(true)
        filteredData = filteredData.filter(
          (task) => (milestone ? !task.milestone_name.localeCompare(milestone) : task.milestone_name),
        )
      } else setIsFilterMI(false)
      if (category) {
        setIsFilterCA(true)
        filteredData = filteredData.filter(
          (task) => (category ? task.category_name.includes(category) : task.category_name),
        )
      } else setIsFilterCA(false)
      setLoading(false)
      setTemperaryData(filteredData)
    }
  }, [milestone, category, valueSearch, statusFilter, originalData.length])

  return (
    <JfLayout id={router.query.id} bgr={2}>
      <JfLayout.Main>
        <Modal
          visible={isAssignModalVisible}
          okText="アサイン"
          cancelText="キャンセル"
          width={1000}
          onOk={() => setIsAssignModalVisible(false)}
          onCancel={() => setIsAssignModalVisible(false)}
        >
          <Table columns={modalColumns} dataSource={selectedData} pagination={false} />
        </Modal>
        <h1>タスクー覧</h1>
        <div className="TaskList">
          <div className=" justify-center">
            <div className="">
              <div className="flex-col space-y-9">
                <div className="flex justify-between">
                  <div className="flex mb-3 items-center justify-center space-x-1">
                    <div>ステータス</div>
                    <Radio.Group
                      disabled={loading}
                      onChange={onStatusFilterChange}
                      defaultValue={statusFilter}
                      buttonStyle="solid"
                      className="flex items-center flex-row"
                    >
                      <Radio.Button
                        className="radio-button p-0 text-center ml-1"
                        value="0"
                      >
                        全て
                      </Radio.Button>
                      <Radio.Button
                        className="radio-button p-0 text-center ml-1"
                        value="1"
                      >
                        未着手
                      </Radio.Button>
                      <Radio.Button
                        className="radio-button w-10 p-0 text-center ml-1"
                        value="2"
                      >
                        進行中
                      </Radio.Button>
                      <Radio.Button
                        className="radio-button p-0 text-center ml-1"
                        value="3"
                      >
                        完了
                      </Radio.Button>
                      <Radio.Button
                        className="radio-button p-0 text-center ml-1"
                        value="4"
                      >
                        中断
                      </Radio.Button>
                      <Radio.Button
                        className="radio-button p-0 text-center ml-1"
                        value="5"
                      >
                        未完了
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                  {role === 'admin' && (
                    <div className="flex">
                      <Button
                        size="large"
                        className="float-right"
                        disabled={!isRowCheck}
                        type="primary"
                        onClick={openAssignModalHandler}
                      >
                        アサイン
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="pr-3">表示件数 </span>
                  <Select size="large" value={itemCount} onChange={handleSelect}>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                    <Option value={50}>50</Option>
                  </Select>
                </div>
                <div className="searchAdd">
                  <Popover
                    content={(
                      <>
                        <h6 className="mb-1" style={{ fontWeight: 700 }}>
                          カテゴリ
                        </h6>

                        <Select
                          size="large"
                          placeholder="カテゴリ"
                          style={{ width: '300px' }}
                          allowClear="true"
                          onChange={handleSelectCategory}
                        >
                          {optionCategory}
                        </Select>

                        <h6 className="mb-1 mt-2" style={{ fontWeight: 700 }}>
                          マイルストーン
                          {' '}
                        </h6>

                        <Select
                          size="large"
                          placeholder="マイルストーン"
                          style={{ width: '300px' }}
                          allowClear="true"
                          onChange={handleSelectMilestone}
                        >
                          {optionMilestone}
                        </Select>
                      </>
                    )}
                    className="mr-2"
                    placement="bottomLeft"
                    trigger="click"
                    visible={visible}
                    onVisibleChange={handleVisibleChange}
                  >
                    {isFilterMI || isFilterCA || visible ? (
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
                    size="large"
                    className="mr-3 no-border"
                    allowClear="true"
                    prefix={<SearchOutlined />}
                    placeholder="タスク名, 担当者"
                    onChange={onSearch}
                    defaultValue={valueSearch}
                  />
                  {role === 'admin' ? (
                    <>
                      <Button
                        size="large"
                        className="float-right"
                        href={`/jobfairs/${router.query.id}/tasks/add`}
                        type="primary"
                      >
                        <span> 追加 </span>
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <Table
              className="mt-5"
              columns={columns}
              dataSource={temperaryData}
              loading={{ spinning: loading, indicator: loadingIcon }}
              rowSelection={role === 'admin' && { onChange: isRowChecked, checkStrictly: false }}
              pagination={pagination}
              // scroll={{ x: 'max-content', y: '90vh' }}
              // bordered
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="データがありません"
                  />
                ),
              }}
            />

          </div>
        </div>
      </JfLayout.Main>
    </JfLayout>
  )
}
TaskList.middleware = ['auth:superadmin', 'auth:member']
export default TaskList
