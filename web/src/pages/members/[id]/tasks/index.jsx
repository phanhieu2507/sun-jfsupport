import React, { useState, useEffect, useCallback } from 'react'
import { Select, Table, Input, Button, Empty, DatePicker, Popover, Tooltip } from 'antd'
import { SearchOutlined, FilterOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Link from 'next/link'
import moment from 'moment'
import Layout from '../../../../layouts/OtherLayout'
import { formatDate, truncate } from '~/utils/utils'
import * as Extensions from '../../../../utils/extensions'
import { MemberApi } from '~/api/member'
import './style.scss'
import Loading from '../../../../components/loading'

const columns = [
  {
    title: 'JF名',
    key: 'JF名',
    dataIndex: 'jobfair_name',
    render: (name) => <Tooltip title={name}>{truncate(name, 20)}</Tooltip>,
    width: '10%',
  },
  {
    title: 'タスク名',
    dataIndex: 'name',
    key: 'タスク名',
    width: '20%',
    render: (name) => `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`,
  },
  {
    title: '開始日',
    key: '開始日',
    dataIndex: 'start_time',
    width: '10%',
    render: (date) => formatDate(date),
  },
  {
    title: '終了日',
    key: '終了日',
    dataIndex: 'end_time',
    width: '10%',
    render: (date) => formatDate(date),
  },
  {
    title: 'ステータス',
    key: 'ステータス',
    dataIndex: 'status',
    width: '10%',
    render: (email) => email,
  },
]

function TaskList() {
  const { Option } = Select
  const router = useRouter()
  const [tasks, setTasks] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [itemCount, setItemCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [id, setID] = useState(0)
  const [pagination, setPagination] = useState({
    position: ['bottomCenter'],
    current: 1,
    pageSize: 10,
    showSizeChanger: false,
  })
  const [optionStatus, setOptionStatus] = useState('すべて')
  const [visible, setVisible] = useState(false)

  const [searchNameValue, setSearchNameValue] = useState('')
  const [searchDateValue, setSearchDateValue] = useState('')
  const handleSelect = (value) => {
    setPagination((preState) => ({
      ...preState,
      pageSize: value,
    }))
    setItemCount(value)
    localStorage.setItem(
      'pagination',
      JSON.stringify({ ...pagination, pageSize: value }),
    )
  }

  const handleChange = (e) => {
    setPagination((preState) => ({
      ...preState,
      current: e.current,
    }))
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

  const check = (obj) => {
    if (optionStatus === 'すべて') {
      return true
    }
    return obj.status.replace(/\s/g, '') === optionStatus.replace(/\s/g, '')
  }

  const checkDate = (obj) => {
    if (searchDateValue === 'Invalid date') {
      return true
    }
    return (
      obj.end_time.toLowerCase().indexOf(searchDateValue.toLowerCase()) > -1
    )
  }

  const filterTasks = (_tasks) => _tasks.filter(
    (obj) => obj.name.toLowerCase().indexOf(searchNameValue.toLowerCase()) > -1
    && checkDate(obj)
    && check(obj),
  )

  const handleInput = () => {
    const result = filterTasks(tasks)
    setFilteredData(result)
  }

  const fetchData = useCallback(() => {
    setLoading(true)
    initPagination()
    MemberApi.getTasksOfMember(router.query.id)
      .then((response) => {
        setID(router.query.id)
        const { data } = response
        const _filteredData = filterTasks(data)
        setFilteredData(_filteredData)
        setTasks(data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  })

  const handleRow = (record) => ({
    onClick: () => {
      router.push(`/jobfairs/${record.schedule.jobfair_id}/tasks/${record.id}`)
    },
  })

  const handleSelectStatus = (value) => {
    setOptionStatus(value.target.innerText)
  }

  const handleInputName = (e) => {
    setSearchNameValue(e.target.value)
  }

  const handleInputDate = (value) => {
    setSearchDateValue(moment(value).format('YYYY/MM/DD'))
  }

  useEffect(() => {
    fetchData()
  }, [itemCount])

  useEffect(() => {
    handleInput()
  }, [optionStatus, searchNameValue, searchDateValue])
  return (
    <div className="MemberTaskList">
      {loading && <Loading loading={loading} overlay={loading} />}
      <Layout>
        <Layout.Main>
          <Link href={`/members/${id}`}>
            <ArrowLeftOutlined className="back-button" />
          </Link>
          <div className="flex flex-col h-full items-center justify-center bg-white-background">
            <h1 className="m-0 flex justify-start w-full mb-5">
              メンバ詳細（タスク一覧）
            </h1>
            <div className="text-xl w-full items-center">
              <div className="flex items-center">
                <div className="mr-5">ステータス:</div>
                <Button
                  onClick={handleSelectStatus}
                  className={`border-0 mx-1 ${
                    optionStatus === 'すべて' ? 'option-active' : ''
                  }`}
                >
                  すべて
                </Button>
                <Button
                  onClick={handleSelectStatus}
                  className={`border-0 mx-1 ${
                    optionStatus === '未着手' ? 'option-active' : ''
                  }`}
                >
                  未着手
                </Button>
                <Button
                  onClick={handleSelectStatus}
                  className={`border-0 mx-1 ${
                    optionStatus === '進行中' ? 'option-active' : ''
                  }`}
                >
                  進行中
                </Button>
                <Button
                  onClick={handleSelectStatus}
                  className={`border-0 mx-1 ${
                    optionStatus === '完 了' ? 'option-active' : ''
                  }`}
                >
                  完了
                </Button>
                <Button
                  onClick={handleSelectStatus}
                  className={`border-0 mx-1 ${
                    optionStatus === '中 断' ? 'option-active' : ''
                  }`}
                >
                  中断
                </Button>
                <Button
                  onClick={handleSelectStatus}
                  className={`border-0 mx-1 ${
                    optionStatus === '未完了' ? 'option-active' : ''
                  }`}
                >
                  未完了
                </Button>
              </div>
            </div>
            <div className="flex w-full items-center justify-between mt-5">
              <div>
                <span className="pr-3">表示件数</span>
                <Select size="large" value={itemCount} onChange={handleSelect}>
                  <Option value={10}>10</Option>
                  <Option value={25}>25</Option>
                  <Option value={50}>50</Option>
                </Select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Popover
                  content={(
                    <>
                      <h6 className="mb-1" style={{ fontWeight: 700 }}>
                        終了日
                      </h6>
                      <DatePicker
                        className=""
                        help="Please select the correct date"
                        format={Extensions.dateFormat}
                        placeholder="終了日"
                        onChange={handleInputDate}
                      />
                    </>
                  )}
                  className="mr-2"
                  placement="bottomLeft"
                  trigger="click"
                  visible={visible}
                  onVisibleChange={handleVisibleChange}
                >
                  {visible ? (
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
                  onChange={handleInputName}
                  placeholder="タスク名"
                  prefix={<SearchOutlined />}
                />
              </div>
            </div>
            <Table
              className="w-full rounded-3xl table-styled my-5 table-striped-rows"
              columns={columns}
              dataSource={filteredData}
              rowKey={(record) => record.id}
              onRow={handleRow}
              onChange={handleChange}
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
        </Layout.Main>
      </Layout>
    </div>
  )
}

TaskList.middleware = ['auth:superadmin', 'auth:member']
export default TaskList
