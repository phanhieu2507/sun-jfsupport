/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useCallback } from 'react'
import {
  Select,
  Input,
  Table,
  Empty,
  Modal,
  notification,
  Space,
  Button,
  Tooltip,
} from 'antd'
import {
  SearchOutlined,
  EditTwoTone,
  ExclamationCircleOutlined,
  DeleteTwoTone,
} from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../layouts/OtherLayout'
import { webInit } from '~/api/web-init'
import { deleteSchedule } from '../../api/schedule-detail'
import { ListScheduleApi } from '~/api/schedule'
import { loadingIcon } from '../../components/loading'

function ScheduleList() {
  const [schedules, setSchedules] = useState([])
  const [filterSchedules, setFilterSchedules] = useState([])
  const [itemCount, setItemCount] = useState(10)
  const [dataLoading, setDataLoading] = useState(false)
  const [pagination, setPagination] = useState({
    position: ['bottomCenter'],
    current: 1,
    pageSize: 10,
    showSizeChanger: false,
  })
  const [user, setUser] = useState({})
  const router = useRouter()
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
  const handleRow = (record) => ({
    onClick: () => {
      router.push(`/schedules/${record.id}`)
    },
  })
  const handleChange = (e) => {
    setPagination((preState) => ({
      ...preState,
      current: e.current,
    }))
  }

  const handleInput = (e) => {
    const result = schedules.filter(
      (obj) => obj.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1,
    )
    setFilterSchedules(result)
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

  const fetchData = useCallback(() => {
    setDataLoading(true)
    initPagination()
    webInit().then((res) => {
      if (res.data.auth != null) {
        setUser(res.data.auth.user)
      }
    })
    ListScheduleApi.getListSchedule()
      .then((res) => {
        const { data } = res
        const reversedData = data.reverse()
        setSchedules(reversedData)
        setFilterSchedules(data)
      }).catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
      .finally(() => {
        setDataLoading(false)
      })
  })

  // fix No. bug
  const Schedules = []
  for (let i = 0; i < filterSchedules.length; i += 1) {
    Schedules.push({
      key: i + 1,
      id: filterSchedules[i].id,
      name: filterSchedules[i].name,
    })
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push('/schedules/add')
  }

  useEffect(() => {
    fetchData()
  }, [itemCount])
  const { Option } = Select
  const role = user.role
  const handleEdit = (id) => {
    router.push(`/schedules/${id}/edit`)
  }
  const saveNotification = () => {
    notification.success({
      duration: 3,
      message: '正常に削除されました',
      // onClick: () => {},
    })
  }
  const deletetpl = async (id) => {
    const newList = Schedules.filter((x) => x.id !== id)
    setSchedules(newList)
    await deleteSchedule(id)
      .then(() => {
        saveNotification()
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
    setPagination((preState) => ({
      ...preState,
      current: 1,
    }))
    fetchData()
  }
  const modelDelete = (id) => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: () => {
        deletetpl(id)
      },
      // onCancel: () => {},
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  const columns = role === 'superadmin'
    ? [
      {
        title: 'スケジュール',
        dataIndex: 'name',
        key: 'スケジュール',
        width: '90%',
        ellipsis: {
          showTitle: false,
        },
        render: (name, record) => (
          <Tooltip title={name}>
            <Link href={`schedules/${record.id}`}>
              <a>{name}</a>
            </Link>
          </Tooltip>
        ),
        onCell: handleRow,
      },
      {
        title: 'アクション',
        key: 'action',
        width: '10%',
        render: (_text, record) => role === 'superadmin' && (
          <Space className="flex items-center" size="middle">
            <EditTwoTone
              id={record.id}
              onClick={() => {
                handleEdit(record.id)
              }}
            />

            <DeleteTwoTone
              id={record.id}
              onClick={() => {
                modelDelete(record.id)
              }}
            />
          </Space>
        ),
      },
    ]
    : [
      {
        title: 'スケジュール',
        dataIndex: 'name',
        key: 'スケジュール',
        width: '95%',
        render: (name) => (
          <Tooltip title={name}>
            <a>{name}</a>
          </Tooltip>
        ),
        onCell: handleRow,
      },
    ]

  return (
    <Layout>
      <Layout.Main>
        <h1>JFスケジュール一覧</h1>
        <div>
          <div
            style={{ width: '100%' }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center justify-start ">
              <span className="mr-3">表示件数 </span>
              <Select size="large" value={itemCount} onChange={handleSelect}>
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
                <Option value={50}>50</Option>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-end">
                <Input
                  placeholder="スケジュール"
                  className="no-border"
                  onChange={handleInput}
                  bordered
                  prefix={<SearchOutlined />}
                />
                <div className="pl-3">
                  {role === 'superadmin' ? (
                    <Button
                      size="large"
                      type="primary"
                      htmlType="button"
                      enabled
                      onClick={handleClick}
                      style={{ letterSpacing: '-0.1em' }}
                    >
                      追加
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Table
          className="mt-5"
          columns={columns}
          dataSource={Schedules}
          rowKey={(record) => record.id}
          onChange={handleChange}
          loading={{ spinning: dataLoading, indicator: loadingIcon }}
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
      </Layout.Main>
    </Layout>
  )
}

ScheduleList.middleware = ['auth:superadmin', 'auth:member']
export default ScheduleList
