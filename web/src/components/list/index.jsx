import React, { useEffect, useState, useRef } from 'react'
import { Table, Input, DatePicker, Tooltip, Card, Select } from 'antd'
import { PlusOutlined, SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { taskSearch } from '../../api/top-page'
import { loadingIcon } from '../loading'
import { getCategories } from '../../api/template-task'
import { getAllMileStone } from '../../api/milestone'
import './style.scss'
// const { Search } = Input;

const List = ({
  id,
  searchIcon,
  text,
  showTimeInput,
  showCategoryInput,
  showMilestoneInput,
  showSearchByJFInput,
  dataColumn,
  dataSource,
  route,
  role,
  routeToAdd,
  isLoading,
}) => {
  const truncate = (input) => (input.length > 15 ? `${input.substring(0, 15)}...` : input)
  const ref = useRef()
  const [show, setShow] = useState(false)
  const [showSearchIcon, setShowSearchIcon] = useState(searchIcon)
  const [newDataColumn, setNewDataColumn] = useState([])
  const [showTable, setShowTable] = useState(true)
  const [list, setList] = useState([])
  const [optionMilestone, setOptionMileStone] = useState([])
  const [optionCategory, setOptionCategory] = useState([])
  const { Option } = Select
  const [filter, setFilter] = useState(() => ({
    name: '',
    milestone: '',
    category: '',
    date: '',
  }))

  const loadCategoryOptions = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(
        <Option key={response.data[i].category_name}>{response.data[i].category_name}</Option>,
      )
    }
    setOptionCategory(option)
  }

  const loadMilestoneOptions = (response) => {
    const option = []
    for (let i = 0; i < response.data.length; i += 1) {
      option.push(<Option key={response.data[i].name}>{response.data[i].name}</Option>)
    }
    setOptionMileStone(option)
  }

  useEffect(async () => {
    setNewDataColumn(
      dataColumn.map((data) => {
        if (data.title.includes('名')) {
          data.render = (row, record) => (
            <Tooltip title={row}>
              {(() => {
                switch (id) {
                  case 2: return <a href={`/members/${record.key}`}>{truncate(row)}</a>
                  case 3: return <a href={`/schedules/${record.key}`}>{truncate(row)}</a>
                  case 4: return <a href={`/template-tasks/${record.key}`}>{truncate(row)}</a>
                  default: return null
                }
              })()}

            </Tooltip>
          )
        }
        return data
      }),
    )
    if (id === 4) {
      await getCategories().then((response) => {
        loadCategoryOptions(response)
      })
      await getAllMileStone().then((response) => {
        loadMilestoneOptions(response)
      })
    }
  }, [])
  useEffect(() => {
    setList(dataSource)
  }, [dataSource])

  useEffect(() => {
    const onBodyClick = (event) => {
      if (ref.current.contains(event.target)) {
        return
      }
      setShow(false)
      setShowSearchIcon(true)
    }

    document.body.addEventListener('click', onBodyClick, { capture: true })

    return () => {
      document.body.removeEventListener('click', onBodyClick, {
        capture: true,
      })
    }
  }, [])
  useEffect(() => {
    let datas = [...list]
    if (filter) {
      if (filter.name) {
        datas = datas.filter(
          (data) => data.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1,
        )
      }
      if (filter.milestone) {
        datas = datas.filter(
          (data) => data.milestone
            .toLowerCase()
            .indexOf(filter.milestone.toLowerCase()) !== -1,
        )
      }
      if (filter.category) {
        datas = datas.filter(
          (data) => data.category.indexOf(filter.category) !== -1,
        )
      }
      if (filter.date) {
        if (dataColumn[1].dataIndex === 'type') { filter.date = filter.date.replace('-', '/') }
        datas = datas.filter(
          (data) => data.time.toLowerCase().indexOf(filter.date.toLowerCase()) !== -1,
        )
      }
      setList(datas)
    }
  }, [filter])
  const onClick = () => {
    setShow(!show)
    setShowSearchIcon(!showSearchIcon)
  }
  const onClickShow = () => {
    setShowTable(!showTable)
  }

  const handleSelectCategory = (value) => {
    if (value) {
      setFilter({ ...filter, category: value })
    } else {
      setFilter({ ...filter, category: '' })
    }
    setList(dataSource)
  }

  const handleSelectMilestone = (value) => {
    if (value) {
      setFilter({ ...filter, milestone: value })
    } else {
      setFilter({ ...filter, milestone: '' })
    }
    setList(dataSource)
  }

  const searchInput = (e, dateString = '') => {
    if (!dateString) {
      if (e.target.name === 'name') {
        setFilter({ ...filter, name: e.target.value })
        if (e.target.value === '') {
          setFilter({ ...filter, name: '' })
          setList(dataSource)
        }
      }
      if (e.target.name === 'milestone') {
        setFilter({ ...filter, milestone: e.target.value })
        if (e.target.value === '') {
          setFilter({ ...filter, milestone: '' })
          setList(dataSource)
        }
      }
      if (e.target.name === 'category') {
        setFilter({ ...filter, category: e.target.value })
        if (e.target.value === '') {
          setFilter({ ...filter, category: '' })
          setList(dataSource)
        }
      }
    } else {
      setFilter({ ...filter, date: dateString })
      if (dateString === '') {
        setFilter({ ...filter, date: '' })
        setList(dataSource)
      }
    }
  }
  const searchByJobfairName = (e) => {
    const getTask = async () => {
      const response = await taskSearch(e.target.value)
      let tasks = []
      tasks = response.data.map((data) => ({
        name: data.name,
        jfName: data.jobfair.name,
        time: data.start_time,
      }))
      setList(tasks)
    }
    getTask()
  }
  return (
    <div className="list-toppage" ref={ref}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          height: '40px',
        }}
      >
        <button
          type="button"
          className="flex items-center font-bold"
          style={{
            fontSize: '24px',
            outline: 'none',
          }}
          onClick={onClickShow}
        >
          <span className="">
            {showTable ? (
              <UpOutlined style={{ fontSize: '20px', marginRight: '5px' }} />
            ) : (
              <DownOutlined
                style={{ fontSize: '20px', marginRight: '5px' }}
              />

            )}
          </span>
          {text}
        </button>

        <div className="flex items-center">
          <Link href={route}>

            <img style={{ width: '24px', marginRight: '4px', height: '24px' }} src="https://cdn0.iconfinder.com/data/icons/web-design-and-development-4/512/180-512.png" alt="" />

          </Link>
          {text === 'タスク' || role === 'member' ? null : (
            <Link className="hv-icon" href={routeToAdd}>
              <PlusOutlined className="hv-icon" style={{ fontSize: '24px', margin: '0 5px' }} />
            </Link>
          )}
          <span className="queue-demo">
            {showSearchIcon && (
              <a className="hv-icon" onClick={onClick}>
                <SearchOutlined
                  style={{ marginLeft: '4px', fontSize: '24px' }}
                />
              </a>
            )}

            <span>
              {show ? (
                <Input
                  // key="demo"
                  style={{
                    width: '200px',
                    height: '40px',

                  }}
                  name="name"
                  className="no-border"
                  placeholder={`${text}名`}
                  onChange={searchInput}
                  bordered
                  prefix={<SearchOutlined />}
                />
              ) : null}
            </span>
          </span>
        </div>
      </div>
      {showTable ? (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
          }}
        >
          <div
            style={{
              display: 'grid',
            }}
          >
            <div className="flex items-center justify-end pl-2">
              {showTimeInput && (
                <div className="flex items-center justify-end pl-2 mb-2">
                  <div>
                    <DatePicker
                      style={{
                        width: '200px',
                        height: '40px',
                      }}
                      name="date"
                      size="large"
                      placeholder="タイム"
                      format="YYYY/MM/DD"
                      onChange={searchInput}
                    />
                  </div>
                </div>
              )}

              {showSearchByJFInput && (
                <div className="flex items-center justify-end pl-2 mb-2">
                  <div>
                    <Input
                      style={{
                        width: '200px',
                        height: '40px',
                      }}
                      name="jobfairName"
                      placeholder="就職フェアの名前"
                      type="text"
                      onChange={searchByJobfairName}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pl-2">
              {showCategoryInput && (
                <div className="flex items-center justify-end pl-2 mb-2">
                  <Select
                    size="large"
                    placeholder="カテゴリ"
                    style={{
                      width: '200px',
                      height: '40px',
                    }}
                    allowClear="true"
                    name="category"
                    onChange={handleSelectCategory}
                  >
                    {optionCategory}
                  </Select>
                </div>
              )}

              {showMilestoneInput && (
                <div className="flex items-center justify-end pl-2 mb-2">
                  <Select
                    size="large"
                    placeholder="マイルストーン"
                    style={{
                      width: '200px',
                      height: '40px',
                    }}
                    allowClear="true"
                    name="milestone"
                    onChange={handleSelectMilestone}
                  >
                    {optionMilestone}
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Table data */}
          <Card bordered={false} style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
            <Table
              pagination={false}
              dataSource={
                list.length >= 5
                  ? list.slice(list.length - 5, list.length).reverse()
                  : list.reverse()
              }
              columns={newDataColumn}
              loading={{ spinning: isLoading, indicator: loadingIcon }}
            />
          </Card>
        </div>
      ) : null}
    </div>
  )
}

List.propTypes = {
  id: PropTypes.number.isRequired,
  searchIcon: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  showTimeInput: PropTypes.bool.isRequired,
  showCategoryInput: PropTypes.bool.isRequired,
  showMilestoneInput: PropTypes.bool.isRequired,
  showSearchByJFInput: PropTypes.bool.isRequired,
  dataColumn: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  route: PropTypes.string.isRequired,
  routeToAdd: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default List
