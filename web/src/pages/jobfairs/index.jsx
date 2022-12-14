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
          JF???: response.data[i].name,
          ?????????: response.data[i].start_date.replaceAll('-', '/'),
          ?????????????????????: response.data[i].number_of_students,
          ??????????????????: response.data[i].number_of_companies,
          ?????????: adminNames,
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
      message: '??????????????????????????????',
      onClick: () => { },
    })
  }
  const confirmModle = (id) => {
    Modal.confirm({
      title: '???????????????????????????????????????',
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
      okText: '??????',
      cancelText: '?????????',
    })
  }
  const columns = [
    {
      title: 'JF???',
      dataIndex: 'JF???',
      fixed: 'left',
      width: '25%',
      ellipsis: {
        showTitle: false,
      },
      render: (JF???, record) => (
        <Tooltip title={JF???}>
          <a href={`/jobfairs/${record.idJF}/jf-toppage`}>{truncateMax20(JF???)}</a>
        </Tooltip>
      ),
      onCell: handleRow,
    },

    {
      title: '?????????',
      dataIndex: '?????????',
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
      title: '?????????????????????',
      dataIndex: '?????????????????????',
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
      title: '??????????????????',
      dataIndex: '??????????????????',
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
      title: '?????????',
      dataIndex: '?????????',
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
      title: users === 'superadmin' ? '???????????????' : '',
      fixed: 'right',
      width: users === 'superadmin' ? '10%' : 1,
      render: (text, record) => users === 'superadmin' && (
        <Space size="middle">
          <a href={`/jobfairs/${record.idJF}/edit`}>
            <abbr title="??????" style={{ cursor: 'pointer' }}>
              <EditTwoTone />
            </abbr>
          </a>
          <abbr title="??????" style={{ cursor: 'pointer' }}>
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
        ? JF.JF???.toLowerCase().includes(value) || JF.?????????.toLowerCase().includes(value)
        : JF.JF???)
        && (rangeStudentsNumber[1] < 100
          ? JF.????????????????????? <= rangeStudentsNumber[1]
          && JF.????????????????????? >= rangeStudentsNumber[0]
          : JF.????????????????????? >= rangeStudentsNumber[0])
        && (rangeBussinessesNumber[1] < 100
          ? JF.?????????????????? <= rangeBussinessesNumber[1]
          && JF.?????????????????? >= rangeBussinessesNumber[0]
          : JF.?????????????????? >= rangeBussinessesNumber[0])
        && (startDate ? !JF.?????????.localeCompare(startDate) : JF.?????????),
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
        ? JF.????????????????????? <= value[1] && JF.????????????????????? >= value[0]
        : JF.????????????????????? >= value[0])
        && (valueSearch
          ? JF.JF???.toLowerCase().includes(valueSearch)
          || JF.?????????.toLowerCase().includes(valueSearch)
          : JF.JF???)
        && (rangeBussinessesNumber[1] < 100
          ? JF.?????????????????? <= rangeBussinessesNumber[1]
          && JF.?????????????????? >= rangeBussinessesNumber[0]
          : JF.?????????????????? >= rangeBussinessesNumber[0])
        && (startDate ? !JF.?????????.localeCompare(startDate) : JF.?????????),
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
        ? JF.?????????????????? <= value[1] && JF.?????????????????? >= value[0]
        : JF.?????????????????? >= value[0])
        && (valueSearch
          ? JF.JF???.toLowerCase().includes(valueSearch)
          || JF.?????????.toLowerCase().includes(valueSearch)
          : JF.JF???)
        && (rangeStudentsNumber[1] < 100
          ? JF.????????????????????? <= rangeStudentsNumber[1]
          && JF.????????????????????? >= rangeStudentsNumber[0]
          : JF.????????????????????? >= rangeStudentsNumber[0])
        && (startDate ? !JF.?????????.localeCompare(startDate) : JF.?????????),
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
      (JF) => (dateString ? !JF.?????????.localeCompare(dateString) : JF.?????????)
        && (valueSearch
          ? JF.JF???.toLowerCase().includes(valueSearch)
          || JF.?????????.toLowerCase().includes(valueSearch)
          : JF.JF???)
        && (rangeStudentsNumber[1] < 100
          ? JF.????????????????????? <= rangeStudentsNumber[1]
          && JF.????????????????????? >= rangeStudentsNumber[0]
          : JF.????????????????????? >= rangeStudentsNumber[0])
        && (rangeBussinessesNumber[1] < 100
          ? JF.?????????????????? <= rangeBussinessesNumber[1]
          && JF.?????????????????? >= rangeBussinessesNumber[0]
          : JF.?????????????????? >= rangeBussinessesNumber[0]),
    )
    setTemperaryData(filteredData)
  }
  const content = (
    <div className="JFList items-center">
      <p className="font-bold spaceM">?????????</p>
      <DatePicker
        className="mb-3"
        size="large"
        inputReadOnly="true"
        placeholder="?????????"
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
      <p className="font-bold spaceMG">?????????????????????</p>
      <Slider range="true" defaultValue={[0, 100]} onAfterChange={FilterStudentsNumber} />
      <p className="font-bold spaceMG">??????????????????</p>
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
                <h1>JF??????</h1>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="pr-3">????????????</span>
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
                    placeholder="JF???, ?????????"
                    onChange={onSearch}
                    value={valueSearch}
                  />
                  {users === 'superadmin' ? (
                    <>
                      <Button size="large" className="float-right" href="/jobfairs/add" type="primary">
                        <span> ?????? </span>
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
                    description="???????????????????????????"
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
