/* eslint-disable no-empty */
import { DeleteTwoTone, SearchOutlined } from '@ant-design/icons'
import { Col, Input, Modal, notification, Row, Select, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { deleteMileStone, getAllMileStone } from '../../api/milestone'
import AddMilestone from './add-milestone'
import EditMilestone from './edit-milestone'
import { webInit } from '../../api/web-init'
import { loadingIcon } from '../loading'
import './styles.scss'
import { truncate } from '~/utils/utils'

const MilestoneList = () => {
  const [isRenderFirstly, setIsRenderFirstly] = useState(true)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [id, setId] = useState()
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [role, setRole] = useState()
  const [isModalType, setIsModalType] = useState({
    delete: false,
    edit: false,
  })

  webInit().then((res) => {
    setRole(res.data.auth.user.role)
  })
  const openNotificationSuccess = () => {
    notification.success({
      message: 'マイルストーンが正常に削除されました',
      duration: 3,
    })
  }

  const convertPeriod = (numOfDays, type) => {
    if (type === 'week') {
      return `${Math.ceil(numOfDays / 7)}週間後`
    }
    return `${numOfDays}日後`
  }

  const fetchData = async (inputSearch = null) => {
    setLoading(true)
    try {
      const res = await getAllMileStone()
      const dataArr = res.data
        .map((row) => ({
          ...row,
          period:
            row.is_week === 1
              ? { numOfDays: row.period * 7, type: 'week' }
              : { numOfDays: row.period, type: 'day' },
        }))
        .sort((a, b) => a.period.numOfDays - b.period.numOfDays)
        .map((row) => {
          const { numOfDays, type } = row.period
          return {
            ...row,
            period_sub: convertPeriod(numOfDays, type),
          }
        })

      if (inputSearch) {
        setData(
          dataArr
            .filter(
              (item) => item.name.toLowerCase().includes(inputSearch.toLowerCase())
                || item.period_sub
                  .toString()
                  .toLowerCase()
                  .includes(inputSearch.toString().toLowerCase()),
            )
            .map((item, idx) => {
              const newItem = { ...item, no: (idx += 1) }
              return newItem
            }),
        )
        setLoading(false)
        return
      }

      const newData = dataArr.map((item, idx) => {
        const newItem = { ...item, no: (idx += 1) }
        return newItem
      })

      setData(newData)
      setLoading(false)
    } catch (error) {
    }
  }

  const searchItemHandler = (e) => {
    setSearchValue(e.target.value)
  }

  const setPageSize = (e) => {
    setPagination((preState) => ({
      ...preState,
      current: 1,
      pageSize: e.value,
    }))
  }

  const tableChangeHandler = (e) => {
    setPagination((preState) => ({ ...preState, current: e.current }))
  }

  /// /////////////////////////////////
  /// ////// Modal function ///////////
  /// /////////////////////////////////
  const handleOk = async () => {
    setIsModalVisible(false)
    try {
      if (isModalType.delete) {
        await deleteMileStone(id)

        setPagination((preState) => ({
          ...preState,
          current: 1,
        }))

        setId(null)
        openNotificationSuccess()
        fetchData()
        setIsModalType((preState) => ({ ...preState, delete: false }))
      }

      if (isModalType.edit) {
        setIsModalType((preState) => ({ ...preState, edit: false }))
        window.location.href = `/milestones/${id}/edit`
      }
    } catch (error) {
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setIsModalType({ delete: false, edit: false })
  }
  const showModal = (type) => {
    setIsModalVisible(true)
    let title
    if (type.edit) {
      title = 'マイルストーンを編集しますか ?'
    } else {
      title = 'マイルストーンを削除しますか ?'
    }
    Modal.confirm({
      title,
      visible: isModalVisible,
      centered: true,
      onOk() {
        handleOk()
      },
      onCancel() {
        handleCancel()
      },
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }

  const columns = [
    {
      title: 'マイルストーン一名',
      dataIndex: 'name',
      render: (taskName) => <a>{truncate(taskName, 15)}</a>,
      width: '60%',
    },
    {
      title: '期日',
      dataIndex: 'period',
      width: `${role === 'superadmin' ? '30%' : '50%'}`,
      render: (period) => {
        const { numOfDays, type } = period
        return <a>{convertPeriod(numOfDays, type)}</a>
      },
    },
    {
      key: 'action',
      title: `${role === 'superadmin' ? 'アクション' : ''}`,
      width: `${role === 'superadmin' ? '10%' : '0%'}`,
      render: (_text, record) => role === 'superadmin' && (
        <Space size="middle">
          <EditMilestone record={record} reloadPage={fetchData} role={role} />
          <DeleteTwoTone className="cursor-default" />

          {/* <DeleteTwoTone
              onClick={() => {
                setId(record.id)
                setIsModalType((preState) => ({
                  ...preState,
                  delete: true,
                }))
              }}
            /> */}
        </Space>
      ),
    },
  ]

  useEffect(() => {
    if (isRenderFirstly) {
      return setIsRenderFirstly(false)
    }
    const timer = setTimeout(() => {
      setPageSize((preState) => ({ ...preState, current: 1 }))
      fetchData(searchValue)
    }, 600)
    return () => {
      clearTimeout(timer)
    }
  }, [searchValue])

  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    if (!isModalType.delete && !isModalType.edit) {
      return
    }
    showModal(isModalType)
  }, [isModalType])

  return (
    <div>
      <div className="container-list">
        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Col />
        </Row>

        <Row style={{ justifyContent: 'space-between' }}>
          <Col>
            <span className="dropdown-label mr-3">表示件数</span>
            <Select
              labelInValue
              defaultValue={{ value: '10' }}
              onChange={(e) => setPageSize(e)}
            >
              <Select.Option value="10">10</Select.Option>
              <Select.Option value="25">25</Select.Option>
              <Select.Option value="50">50</Select.Option>
            </Select>
          </Col>
          <div className="searchAdd">
            <Input
              placeholder="マイルストーン一名, 期日"
              className="no-border"
              onChange={(e) => searchItemHandler(e)}
              value={searchValue}
              prefix={<SearchOutlined />}
            />
            {role === 'superadmin' && (<AddMilestone reloadPage={fetchData} role={role} />)}
          </div>
        </Row>

        <div className="mt-5">
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={pagination}
            loading={{ spinning: loading, indicator: loadingIcon }}
            onChange={(e) => tableChangeHandler(e)}
          />
        </div>
      </div>
    </div>
  )
}

export default MilestoneList
