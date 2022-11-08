import React, { useEffect, useState, useRef } from 'react'
import { Table, Input, DatePicker, Tooltip, Card } from 'antd'
import { PlusOutlined, SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { taskSearch } from '../../api/top-page'
import { loadingIcon } from '../loading'
import './style.scss'
// const { Search } = Input;

const ListJfToppage = ({
  routeToAdd,
  role,
  searchIcon,
  text,
  showTimeInput,
  showSearchByJFInput,
  dataColumn,
  dataSource,
  route,
  isLoading,
}) => {
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const ref = useRef()
  const [show, setShow] = useState(false)
  const [showSearchIcon, setShowSearchIcon] = useState(searchIcon)
  const [newDataColumn, setNewDataColumn] = useState([])
  const [showTable, setShowTable] = useState(true)
  const [list, setList] = useState([])
  const [filter, setFilter] = useState(() => ({
    name: '',
    milestone: '',
    category: '',
    date: '',
  }))
  useEffect(() => {
    setNewDataColumn(
      dataColumn.map((data) => {
        if (data.title === '名前') {
          data.render = (row, record) => (
            <a href={`/jobfairs/${record.key}/jf-toppage`}>
              <div className="top-row">
                {' '}
                <Tooltip title={row}>
                  <a style={{ fontSize: '18px' }} href={`/jobfairs/${record.key}/jf-toppage`}>{truncate(row)}</a>
                </Tooltip>
              </div>
              <div className="bottom-row">
                <a href={`/jobfairs/${record.key}/tasks`}>タスク一覧</a>
                <span className="sp">|</span>
                <a href={`/jobfairs/${record.key}/gantt-chart`}>ガントチャート</a>
                <span className="sp">|</span>
                <a href={`/jobfairs/${record.key}/kanban`}>カンバン</a>
                <span className="sp">|</span>
                <a href={`/jobfairs/${record.key}/files`}>ファイル</a>
              </div>
            </a>
          )
        }
        if (data.title === 'タイム') {
          data.render = (row) => (
            <div className="time">
              {/* <span>開始日: </span> */}
              <span>{row}</span>
            </div>
          )
        }
        return data
      }),
    )
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
    let datas = [...dataSource]
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
          (data) => data.category
            .toLowerCase()
            .indexOf(filter.category.toLowerCase()) !== -1,
        )
      }
      if (filter.date) {
        if (dataColumn[1].dataIndex === 'type') filter.date = filter.date.replace('-', '/')
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

  const searchInput = (e, dateString = '') => {
    if (dateString === '') {
      setFilter({ ...filter, date: '' })
      setList(dataSource)
      if (e !== null) {
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
      }
    } else {
      setFilter({ ...filter, date: dateString })
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
    <div className="toppage-jf-list" ref={ref} bordered={false}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
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
                  className="hv-icon"
                  style={{ marginLeft: '4px', fontSize: '24px' }}
                />
              </a>
            )}

            <span>
              {show ? (
                <Input
                  style={{
                    width: '200px',
                    height: '40px',
                  }}
                  // key="demo"
                  name="name"
                  className="no-border"
                  placeholder="ジョブフェア名"
                  onChange={searchInput}
                  defaultValue={filter.name}
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
            <div className="flex items-center justify-end">
              {showTimeInput && (
                <div className="flex items-center justify-end">
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
                <div className="flex items-center justify-end px-2">
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
          </div>

          {/* Table data */}
          <Card bordered={false} style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', marginTop: '10px' }}>
            <Table
              pagination={false}
              dataSource={list.length >= 5
                ? list.slice(list.length - 5, list.length).reverse()
                : list.reverse()}
              columns={newDataColumn}
              loading={{ spinning: isLoading, indicator: loadingIcon }}
            />
          </Card>
        </div>
      ) : null}
    </div>
  )
}

ListJfToppage.propTypes = {
  searchIcon: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  showTimeInput: PropTypes.bool.isRequired,
  showSearchByJFInput: PropTypes.bool.isRequired,
  dataColumn: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  route: PropTypes.string.isRequired,
  routeToAdd: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default ListJfToppage
