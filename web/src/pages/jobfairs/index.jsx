/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Slider,
  DatePicker,
  Input,
  Empty,
  Select,
  Tooltip,
  Space,
  Modal,
  notification,
  Popover,
} from 'antd'
import './style.scss'
import {
  SearchOutlined,
  FilterOutlined,
  EditTwoTone,
  DeleteTwoTone,
  ExclamationCircleOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import OtherLayout from '../../layouts/OtherLayout'
import { loadingIcon } from '~/components/loading'
import { getJFList, deleteJF } from '../../api/jf-list'
import { webInit } from '../../api/web-init'

function JFList() {
  // state of table
  const [users, setUsers] = useState('')
  const [visible, setVisible] = useState(false)
  const [itemCount, setItemCount] = useState(10)
  const [pagination, setPagination] = useState({
    position: ['bottomCenter'],
    showTitle: false,
    showSizeChanger: false,
    pageSize: 10,
  })
  const [loading, setLoading] = useState(false)
  const [originalData, setOriginalData] = useState()
  const [temperaryData, setTemperaryData] = useState()
  const { Option } = Select
  const router = useRouter()
  const [statusFilterA, setStatusFilterA] = useState(false)
  const [statusFilterB, setStatusFilterB] = useState(false)
  const [statusFilterC, setStatusFilterC] = useState(false)
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
  const handleRow = (record) => ({
    onClick: () => {
      router.push(`/jobfairs/${record.idJF}/jf-toppage`)
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
        const adminNames = (response.data[i].admins && response.data[i].admins.length > 0) ? response.data[i].admins.map((admin) => admin.name) : []
        data.push({
          id: i + 1,
          idJF: response.data[i].id,
          JF名: response.data[i].name,
          開始日: response.data[i].start_date.replaceAll('-', '/'),
          推定参加学生数: response.data[i].number_of_students,
          参加企業社数: response.data[i].number_of_companies,
          管理者: adminNames,
        })
      }
      setTemperaryData(data)
      setOriginalData(data)
    }
  }
  function truncateMax20(str) {
    return str.length > 20 ? `${str.substring(0, 20)}...` : str
  }
  // columns of tables

  // delete and edit jobfair

  const openNotificationSuccess = () => {
    notification.success({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      duration: 3,
      message: '正常に削除されました',
      onClick: () => { },
    })
  }
  const confirmModle = (id) => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: async () => {
        setLoading(true)
        try {
          await deleteJF(id).then((response) => {
            addDataOfTable(response)
            openNotificationSuccess()
          })
        } catch (error) {
          if (error.response.status === 404) {
            router.push('/404')
          } else Error(error.toString())
        }
        setLoading(false)
      },
      onCancel: () => { },
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  const columns = [
    {
      title: 'JF名',
      dataIndex: 'JF名',
      fixed: 'left',
      width: '25%',
      ellipsis: {
        showTitle: false,
      },
      render: (JF名, record) => (
        <Tooltip title={JF名}>
          <a href={`/jobfairs/${record.idJF}/jf-toppage`}>{truncateMax20(JF名)}</a>
        </Tooltip>
      ),
      onCell: handleRow,
    },

    {
      title: '開始日',
      dataIndex: '開始日',
      fixed: 'left',
      width: '13%',
      ellipsis: {
        showTitle: false,
      },
      render: (taskName) => (
        <Tooltip title={taskName}>
          <a>{taskName}</a>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: '推定参加学生数',
      dataIndex: '推定参加学生数',
      width: '13%',
      responsive: ['md'],
      ellipsis: {
        showTitle: false,
      },
      render: (studentNumber) => (
        <Tooltip title={studentNumber}>
          <a>
            {' '}
            {studentNumber}
          </a>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: '参加企業社数',
      dataIndex: '参加企業社数',
      width: '13%',
      responsive: ['sm'],
      ellipsis: {
        showTitle: false,
      },
      render: (bussinessNumber) => (
        <Tooltip title={bussinessNumber}>
          <a>
            {' '}
            {bussinessNumber}
          </a>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: '管理者',
      dataIndex: '管理者',
      width: '25%',
      ellipsis: {
        showTitle: false,
      },
      render: (adminNames) => (
        <Tooltip title={adminNames.length > 0 ? adminNames.join(', ') : ''}>
          <a>
            {adminNames.length > 0 ? adminNames.join(', ') : ''}
          </a>
        </Tooltip>
      ),
      onCell: handleRow,
    },
    {
      title: users === 'superadmin' ? 'アクション' : '',
      fixed: 'right',
      width: users === 'superadmin' ? '10%' : 1,
      render: (text, record) => users === 'superadmin' && (
        <Space size="middle">
          <a href={`/jobfairs/${record.idJF}/edit`}>
            <abbr title="編集" style={{ cursor: 'pointer' }}>
              <EditTwoTone />
            </abbr>
          </a>
          <abbr title="消去" style={{ cursor: 'pointer' }}>
            <DeleteTwoTone
              onClick={() => {
                confirmModle(record.idJF)
              }}
            />
          </abbr>
        </Space>
      ),
    },
  ]

  useEffect(async () => {
    setLoading(true)
    initPagination()
    await getJFList().then((response) => {
      addDataOfTable(response)
    }).catch((error) => {
      if (error.response.status === 404) {
        router.push('/404')
      }
    })
    await webInit()
      .then((response) => {
        setUsers(response.data.auth.user.role)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        } else Error(error.toString())
      })
    setLoading(false)
  }, [])

  // State of filter
  const [valueSearch, setValueSearch] = useState('')
  const [rangeStudentsNumber, setRangeStudentsNumber] = useState([0, 100])
  const [rangeBussinessesNumber, setRangeBussinessesNumber] = useState([0, 100])
  const [startDate, setStartDate] = useState('')

  // Search data on Table

  const searchDataOnTable = (value) => {
    value = value.toLowerCase()
    const filteredData = originalData.filter(
      (JF) => (value
        ? JF.JF名.toLowerCase().includes(value) || JF.管理者.toLowerCase().includes(value)
        : JF.JF名)
        && (rangeStudentsNumber[1] < 100
          ? JF.推定参加学生数 <= rangeStudentsNumber[1]
          && JF.推定参加学生数 >= rangeStudentsNumber[0]
          : JF.推定参加学生数 >= rangeStudentsNumber[0])
        && (rangeBussinessesNumber[1] < 100
          ? JF.参加企業社数 <= rangeBussinessesNumber[1]
          && JF.参加企業社数 >= rangeBussinessesNumber[0]
          : JF.参加企業社数 >= rangeBussinessesNumber[0])
        && (startDate ? !JF.開始日.localeCompare(startDate) : JF.開始日),
    )
    setTemperaryData(filteredData)
  }
  const onSearch = (e) => {
    const currValue = e.target.value
    setValueSearch(currValue)
    searchDataOnTable(currValue)
  }

  // filter by number of students

  const FilterStudentsNumber = (value) => {
    if (value[1] === 100 && value[0] === 0) {
      setStatusFilterA(false)
    } else {
      setStatusFilterA(true)
    }
    setRangeStudentsNumber(value)
    const filteredData = originalData.filter(
      (JF) => (value[1] < 100
        ? JF.推定参加学生数 <= value[1] && JF.推定参加学生数 >= value[0]
        : JF.推定参加学生数 >= value[0])
        && (valueSearch
          ? JF.JF名.toLowerCase().includes(valueSearch)
          || JF.管理者.toLowerCase().includes(valueSearch)
          : JF.JF名)
        && (rangeBussinessesNumber[1] < 100
          ? JF.参加企業社数 <= rangeBussinessesNumber[1]
          && JF.参加企業社数 >= rangeBussinessesNumber[0]
          : JF.参加企業社数 >= rangeBussinessesNumber[0])
        && (startDate ? !JF.開始日.localeCompare(startDate) : JF.開始日),
    )
    setTemperaryData(filteredData)
  }
  // filter by number of businesses

  const FilterBussinessesNumber = (value) => {
    if (value[1] === 100 && value[0] === 0) {
      setStatusFilterB(false)
    } else {
      setStatusFilterB(true)
    }
    setRangeBussinessesNumber(value)
    const filteredData = originalData.filter(
      (JF) => (value[1] < 100
        ? JF.参加企業社数 <= value[1] && JF.参加企業社数 >= value[0]
        : JF.参加企業社数 >= value[0])
        && (valueSearch
          ? JF.JF名.toLowerCase().includes(valueSearch)
          || JF.管理者.toLowerCase().includes(valueSearch)
          : JF.JF名)
        && (rangeStudentsNumber[1] < 100
          ? JF.推定参加学生数 <= rangeStudentsNumber[1]
          && JF.推定参加学生数 >= rangeStudentsNumber[0]
          : JF.推定参加学生数 >= rangeStudentsNumber[0])
        && (startDate ? !JF.開始日.localeCompare(startDate) : JF.開始日),
    )
    setTemperaryData(filteredData)
  }

  // filter by start date

  const FilterStartDate = (date, dateString) => {
    if (!dateString) {
      setStatusFilterC(false)
    } else {
      setStatusFilterC(true)
    }
    setStartDate(dateString)
    const filteredData = originalData.filter(
      (JF) => (dateString ? !JF.開始日.localeCompare(dateString) : JF.開始日)
        && (valueSearch
          ? JF.JF名.toLowerCase().includes(valueSearch)
          || JF.管理者.toLowerCase().includes(valueSearch)
          : JF.JF名)
        && (rangeStudentsNumber[1] < 100
          ? JF.推定参加学生数 <= rangeStudentsNumber[1]
          && JF.推定参加学生数 >= rangeStudentsNumber[0]
          : JF.推定参加学生数 >= rangeStudentsNumber[0])
        && (rangeBussinessesNumber[1] < 100
          ? JF.参加企業社数 <= rangeBussinessesNumber[1]
          && JF.参加企業社数 >= rangeBussinessesNumber[0]
          : JF.参加企業社数 >= rangeBussinessesNumber[0]),
    )
    setTemperaryData(filteredData)
  }
  const content = (
    <div className="JFList items-center">
      <p className="font-bold spaceM">開始日</p>
      <DatePicker
        className="mb-3"
        size="large"
        inputReadOnly="true"
        placeholder="開始日"
        style={{ width: '300px' }}
        onChange={FilterStartDate}
        format="YYYY/MM/DD"
        dateRender={(current) => {
          const style = {}
          if (current.date() === 1) {
            style.border = '1px solid #1890ff'
            style.borderRadius = '50%'
          }
          return (
            <div className="ant-picker-cell-inner" style={style}>
              {current.date()}
            </div>
          )
        }}
      />
      <p className="font-bold spaceMG">推定参加学生数</p>
      <Slider range="true" defaultValue={[0, 100]} onAfterChange={FilterStudentsNumber} />
      <p className="font-bold spaceMG">参加企業社数</p>
      <Slider range="true" defaultValue={[0, 100]} onAfterChange={FilterBussinessesNumber} />
    </div>
  )
  return (
    <OtherLayout>
      <OtherLayout.Main>
        <div className="JFList">
          <div className="mx-auto flex flex-col  justify-center">
            <div className="">
              <div className="flex items-center">
                <h1>JF一覧</h1>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="pr-3">表示件数</span>
                  <Select size="large" value={itemCount} onChange={handleSelect}>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                    <Option value={50}>50</Option>
                  </Select>
                </div>
                <div className="flex">
                  <Popover onVisibleChange={handleVisibleChange} visible={visible} className="mr-2" placement="bottomLeft" content={content} trigger="click">
                    <Button
                      size="large"
                      shape="circle"
                      style={{ background: statusFilterA || statusFilterB || statusFilterC || visible ? '#ffd803' : null }}
                      icon={(
                        <FilterOutlined />
                      )}
                    />
                  </Popover>
                  <Input
                    className="mr-3 no-border"
                    allowClear="true"
                    prefix={<SearchOutlined />}
                    placeholder="JF名, 管理者"
                    onChange={onSearch}
                    value={valueSearch}
                  />
                  {users === 'superadmin' ? (
                    <>
                      <Button size="large" className="float-right" href="/jobfairs/add" type="primary">
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
              rowKey={(record) => record.id}
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
JFList.middleware = ['auth:superadmin', 'auth:member']
export default JFList
