/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Table, Input, Empty, Popover, Modal, Select, notification, Tooltip, Button, Space } from 'antd'
import './style.scss'
import { SearchOutlined, FilterOutlined, ExclamationCircleOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Link from 'next/link'
import OtherLayout from '../../layouts/OtherLayout'
import { getTaskList, getCategories, deleteTptt } from '../../api/template-task'
import { getAllMileStone } from '../../api/milestone'
import { webInit } from '../../api/web-init'
import { loadingIcon } from '../../components/loading'

function TemplateTaskList() {
  // state of table
  const [isFilterCA, setIsFilterCA] = useState(false)
  const [isFilterCI, setIsFilterCI] = useState(false)
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const [users, setUsers] = useState('')
  const [itemCount, setItemCount] = useState(10)
  const [pagination, setPagination] = useState({ position: ['bottomCenter'], showTitle: false, showSizeChanger: false, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [originalData, setOriginalData] = useState()
  const [temperaryData, setTemperaryData] = useState()
  const [optionMilestone, setOptionMileStone] = useState([])
  const [optionCategory, setOptionCategory] = useState([])
  const [valueSearch, setValueSearch] = useState('')
  const { Option } = Select
  const [category, setCategory] = useState('')
  const [milestone, setMilestone] = useState('')
  // select number to display
  const handleSelect = (value) => {
    setPagination((preState) => ({
      ...preState,
      pageSize: value,
    }))
    setItemCount(value)
    localStorage.setItem('pagination', JSON.stringify({ ...pagination, pageSize: value }))
  }
  const handleRow = (record) => ({
    onClick: () => {
      router.push(`/template-tasks/${record.idTemplateTask}`)
    },
  })
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
  const addDataOfTable = (response) => {
    const data = []
    if (response) {
      for (let i = 0; i < response.data.length; i += 1) {
        if (response.data[i].categories[0] && response.data[i].milestone) {
          const categoryName = []
          for (let j = 0; j < response.data[i].categories.length; j += 1) {
            categoryName.push(response.data[i].categories[j].category_name)
          }
          data.push({
            id: i + 1,
            idTemplateTask: response.data[i].id,
            templateTaskName: response.data[i].name,
            category_name: categoryName,
            milestone_name: response.data[i].milestone.name,
          })
        } else {
          data.push({
            id: i + 1,
            idTemplateTask: response.data[i].id,
            templateTaskName: response.data[i].name,
            category_name: '',
            milestone_name: response.data[i].milestone.name,
          })
        }
      }
      setTemperaryData(data)
      setOriginalData(data)
    }
  }

  const addOptionCategory = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option key={response.data[i].category_name}>{response.data[i].category_name}</Option>,
      )
    }
    setOptionCategory(option)
  }

  const addOptionMilestone = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option key={response.data[i].name}>{response.data[i].name}</Option>,
      )
    }
    setOptionMileStone(option)
  }
  const handleEdit = (id) => {
    router.push(`/template-tasks/${id}/edit`)
  }
  const handleVisibleChange = () => {
    setVisible(!visible)
  }
  const saveNotification = () => {
    notification.success({
      duration: 3,
      message: '正常に削除されました',
      onClick: () => { },
    })
  }
  const deletetpl = async (id) => {
    try {
      const newList = temperaryData.filter((x) => x.idTemplateTask !== id)
      setTemperaryData(newList)
      await deleteTptt(id)
      saveNotification()
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }
  const modelDelete = (id) => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: () => {
        deletetpl(id)

        // remove deleted task from display data
        const newOriginalData = originalData.filter((item) => item.idTemplateTask !== id)
        setOriginalData(newOriginalData)
      },
      onCancel: () => { },
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  // columns of tables

  const columns = users === 'superadmin' ? [
    {
      title: 'テンプレートタスク名',
      dataIndex: 'templateTaskName',
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      width: '27%',
      render: (templateTaskName, record) => (
        <Tooltip title={templateTaskName}>
          <div className="inline">
            <Link href={`/template-tasks/${record.idTemplateTask}`}>
              <a>{templateTaskName}</a>
            </Link>
          </div>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: 'カテゴリ',
      dataIndex: 'category_name',
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      width: '27%',
      render: (categoryName, record) => (
        <Tooltip title={categoryName}>
          <div className="inline">
            <Link href={`/template-tasks/${record.idTemplateTask}`}>
              <a>{categoryName.length > 0 ? categoryName.join(', ') : ''}</a>
            </Link>
          </div>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: 'マイルストーン',
      dataIndex: 'milestone_name',
      ellipsis: {
        showTitle: false,
      },
      width: '25%',
      render: (milestoneName, record) => (
        <Tooltip title={milestoneName}>
          <div className="inline">
            <Link href={`/template-tasks/${record.idTemplateTask}`}>
              <a>{milestoneName}</a>
            </Link>
          </div>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: 'アクション',
      key: 'action',
      width: '10%',
      render: (_text, record) => users === 'superadmin' && (
        <Space size="middle">
          <EditTwoTone
            id={record.id}
            onClick={() => {
              handleEdit(record.idTemplateTask)
            }}
          />

          <DeleteTwoTone
            id={record.id}
            onClick={() => {
              modelDelete(record.idTemplateTask)
            }}
          />
        </Space>
      ),
    },
  ] : [
    {
      title: 'テンプレートタスク名',
      dataIndex: 'templateTaskName',
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (templateTaskName, record) => (
        <Tooltip title={templateTaskName}>
          <div className="inline">
            <Link href={`/template-tasks/${record.idTemplateTask}`}>
              <a>{templateTaskName}</a>
            </Link>
          </div>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: 'カテゴリ',
      dataIndex: 'category_name',
      fixed: 'left',
      render: (categoryName, record) => (
        <Tooltip title={categoryName}>
          <div className="inline">
            <Link href={`/template-tasks/${record.idTemplateTask}`}>
              <a>{categoryName.length > 0 ? categoryName.join(', ') : ''}</a>
            </Link>
          </div>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: 'マイルストーン',
      dataIndex: 'milestone_name',
      render: (milestoneName, record) => (
        <Tooltip title={milestoneName}>
          <div className="inline">
            <Link href={`/template-tasks/${record.idTemplateTask}`}>
              <a>{milestoneName}</a>
            </Link>
          </div>
        </Tooltip>
      ),
      onCell: handleRow,
    },
  ]

  // data of table get from database

  useEffect(async () => {
    setLoading(true)
    initPagination()
    try {
      await getTaskList().then((response) => {
        addDataOfTable(response)
      })
      await getAllMileStone().then((response) => {
        addOptionMilestone(response)
      })
      await webInit().then((response) => {
        setUsers(response.data.auth.user.role)
      })
        .catch((error) => Error(error.toString()))
      setLoading(false)
      await getCategories().then((response) => {
        addOptionCategory(response)
      })
    } catch (error) {
      setLoading(false)
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }, [])

  // Search data on Table

  const searchDataOnTable = (value) => {
    const filteredData = originalData.filter(
      // eslint-disable-next-line max-len
      (templateTask) => (value ? templateTask.templateTaskName.toLowerCase().includes(value) : templateTask.templateTaskName)
        && (category ? templateTask.category_name.includes(category) : templateTask.category_name)
        && (milestone ? !templateTask.milestone_name.localeCompare(milestone) : templateTask.milestone_name),
    )
    setTemperaryData(filteredData)
  }

  const onSearch = (e) => {
    const currValue = e.target.value.toLowerCase()
    setValueSearch(currValue)
    searchDataOnTable(currValue)
  }

  const handleSelectCategory = (value) => {
    if (value) {
      setIsFilterCA(true)
    } else setIsFilterCA(false)
    setCategory(value)
    const filteredData = originalData.filter(
      (templateTask) => (value ? templateTask.category_name.includes(value) : templateTask.category_name)
        // eslint-disable-next-line max-len
        && (valueSearch ? templateTask.templateTaskName.toLowerCase().includes(valueSearch) : templateTask.templateTaskName)
        && (milestone ? !templateTask.milestone_name.localeCompare(milestone) : templateTask.milestone_name),
    )
    setTemperaryData(filteredData)
  }

  const handlSelectMilestone = (value) => {
    if (value) {
      setIsFilterCI(true)
    } else setIsFilterCI(false)
    setMilestone(value)
    const filteredData = originalData.filter(
      (templateTask) => (value ? !templateTask.milestone_name.localeCompare(value) : templateTask.milestone_name)
          // eslint-disable-next-line max-len
          && (valueSearch ? templateTask.templateTaskName.toLowerCase().includes(valueSearch) : templateTask.templateTaskName)
          && (category ? templateTask.category_name.includes(category) : templateTask.category_name),
    )
    setTemperaryData(filteredData)
  }
  return (
    <OtherLayout>
      <OtherLayout.Main>
        <h1>テンプレートタスクー覧</h1>
        <div className="TemplateTaskList">
          <div className="mx-auto flex flex-col justify-center">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="pr-3">表示件数</span>
                  <Select size="large" value={itemCount} onChange={handleSelect}>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                    <Option value={50}>50</Option>
                  </Select>
                </div>
                <div>
                  <div className="searchAdd">
                    <Popover
                      content={(
                        <>
                          <h6 className="mb-1" style={{ fontWeight: 700 }}>カテゴリ</h6>

                          <Select size="large" style={{ width: '300px' }} className="w-1/4" placeholder="カテゴリ" allowClear="true" onChange={handleSelectCategory}>
                            {optionCategory}
                          </Select>

                          <h6 className="mb-1 mt-2" style={{ fontWeight: 700 }}>マイルストーン </h6>

                          <Select size="large" style={{ width: '300px' }} className="w-1/4" placeholder="マイルストーン" allowClear="true" onChange={handlSelectMilestone}>
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
                      {isFilterCI || isFilterCA || visible ? (
                        <Button
                          size="large"
                          shape="circle"
                          style={{ background: '#ffd803' }}
                          icon={<FilterOutlined id="filter" />}
                        />
                      ) : (
                        <Button
                          size="large"
                          shape="circle"
                          icon={<FilterOutlined id="filter" />}
                        />
                      )}
                    </Popover>
                    <Input
                      className="float-right mr-3"
                      allowClear="true"
                      prefix={<SearchOutlined />}
                      placeholder="テンプレートタスク名"
                      onChange={onSearch}
                      value={valueSearch}
                    />
                    {users === 'superadmin' ? (
                      <>
                        <Button
                          size="large"
                          className="float-right"
                          href="/template-tasks/add"
                          type="primary"
                        >
                          <span> 追加 </span>
                        </Button>
                      </>
                    )
                      : null}
                  </div>

                </div>
              </div>
            </div>
            <Table
              className="mt-5"
              columns={columns}
              dataSource={temperaryData}
              loading={{ spinning: loading, indicator: loadingIcon }}
              pagination={pagination}
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
      </OtherLayout.Main>
    </OtherLayout>
  )
}
TemplateTaskList.middleware = ['auth:superadmin', 'auth:member']
export default TemplateTaskList
