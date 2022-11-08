import React, { useEffect, useState, useRef } from 'react'
import { Button, Table, Input, Tooltip, Tag } from 'antd'
import {
  SearchOutlined,
  DownOutlined,
  UpOutlined,
  // ExportOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { loadingIcon } from '../loading'
import './style.scss'

// const { Search } = Input;

const TaskSubTable = ({
  searchIcon,
  text,
  taskReviewerList,
  dataColumn,
  dataSource,
  route,
  isLoading,
}) => {
  const truncate = (input) => (input.length > 15 ? `${input.substring(0, 15)}...` : input)
  const ref = useRef()
  const [newDataColumn, setNewDataColumn] = useState([])
  const [show, setShow] = useState(false)
  const [showTable, setShowTable] = useState(true)
  const [showSearchIcon, setShowSearchIcon] = useState(searchIcon)
  const [list, setList] = useState([])
  const [optionStatus, setOptionStatus] = useState('すべて')
  const [optionReviewer, setOptionReviewer] = useState('すべて')
  const [filter, setFilter] = useState(() => ({
    name: '',
    date: '',
    status: '',
    reviewer_task: [],
  }))

  function parseDate(str) {
    const mdy = str.split('/')
    return new Date(mdy[0], mdy[1] - 1, mdy[2])
  }
  function datediff(first, second) {
    return Math.ceil((first - second) / (1000 * 60 * 60 * 24))
  }
  function taskNameToLink(name) {
    let id = 0
    let jobfairID = 0
    dataSource.forEach((item) => {
      if (item.name.indexOf(name.row) > -1) {
        id = item.key
        jobfairID = item.jobfair_id
      }
    })
    return `/jobfairs/${jobfairID}/tasks/${id}`
  }
  useEffect(() => {
    setList(dataSource)
    const today = new Date()
    dataSource.map((data) => {
      if (data.status === '中断') {
        data.time = '中断'
      } else if (datediff(parseDate(data.time), today) > 0) {
        data.time = `後${datediff(parseDate(data.time), today)}日`
      } else if (datediff(parseDate(data.time), today) < 0) {
        data.time = `${-datediff(parseDate(data.time), today)}日遅れ`
      } else {
        data.time = '今日'
      }

      return null
    })
    setNewDataColumn(
      dataColumn.map((dataItem) => {
        if (dataItem.title === 'タスク名') {
          dataItem.render = (row) => (
            <a href={taskNameToLink({ row })}>
              <Tooltip title={row}>
                <p>{truncate(row)}</p>
              </Tooltip>
            </a>
          )
        }
        if (dataItem.title === 'JF名') {
          dataItem.render = (row) => (
            <Tooltip title={row}>
              <a>{truncate(row)}</a>
            </Tooltip>
          )
        }
        if (dataItem.title === 'タイム') {
          dataItem.render = (row) => {
            let color = ''
            if (row.indexOf('中断') !== -1) {
              color = 'geekblue'
            } else if (row.indexOf('日遅れ') !== -1) {
              color = 'volcano'
            } else if (row.indexOf('後') !== -1) {
              color = 'green'
            }
            return (
              <Tag color={color} key={row}>
                {row}
              </Tag>
            )
          }
        }
        return dataItem
      }),
    )
  }, [dataSource])
  useEffect(() => {
    let datas = [...list]
    if (filter) {
      if (filter.status === '未着手') {
        datas = datas.filter(
          (data) => data.status === '未着手' && data.time.indexOf('後') !== -1,
        )
      } else if (filter.status === '進行中') {
        datas = datas.filter(
          (data) => data.status === '進行中' && data.time.indexOf('後') !== -1,
        )
      } else if (filter.status === '今まで') {
        datas = datas.filter(
          (data) => data.time.indexOf('今') !== -1,
        )
      } else if (filter.status === '期限きれ') {
        datas = datas.filter(
          (data) => data.time.indexOf('日遅れ') !== -1,
        )
      }
      if (filter.reviewer_task.length > 0) {
        datas = datas.filter(
          (data) => filter.reviewer_task.includes(data.key) === true,
        )
      }
      if (filter.date) {
        if (dataColumn[1].dataIndex === 'type') filter.date = filter.date.replace('-', '/')
        datas = datas.filter(
          (data) => data.time.toLowerCase().indexOf(filter.date.toLowerCase()) !== -1,
        )
      }
      setList(datas)
    } else {
      setList(dataSource)
    }
  }, [filter])
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

  const onClick = () => {
    setShow(!show)
    setShowSearchIcon(!showSearchIcon)
  }

  const onClickShow = () => {
    setShowTable(!showTable)
  }
  const handleSelectStatus = (value) => {
    setOptionStatus(value.target.innerText)
    if (value.target.innerText === 'すべて') setFilter({ ...filter, status: '' })
    else setFilter({ ...filter, status: value.target.innerText })
    setList(dataSource)
  }
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
  }
  const handleSelectReviewer = (value) => {
    filter.reviewer_task = []
    const tempTask = []
    setOptionReviewer(value.target.innerText)
    if (value.target.innerText === 'すべて') {
      dataSource.forEach((item) => {
        tempTask.push(item.key)
      })
      taskReviewerList.forEach((item) => {
        tempTask.push(item.id)
      })
      const unique = tempTask.filter(onlyUnique)
      setFilter({ ...filter, reviewer_task: unique })
    } else if (value.target.innerText === '担当者') {
      dataSource.forEach((item) => {
        tempTask.push(item.key)
      })
      setFilter({ ...filter, reviewer_task: tempTask })
    } else {
      taskReviewerList.forEach((item) => {
        tempTask.push(item.id)
      })
      setFilter({ ...filter, reviewer_task: tempTask })
    }
    setList(dataSource)
  }
  const searchInput = (e, dateString = '') => {
    if (!dateString) {
      if (e.target.name === 'name') {
        const datas = dataSource.filter(
          (data) => data.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1,
        )
        setList(datas)
      }
    } else {
      setFilter({ ...filter, date: dateString })
      if (dateString === '') {
        setFilter({ ...filter, date: '' })
        setList(dataSource)
      }
    }
  }
  return (
    <div ref={ref} className="task-sub-table">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '36px',
          height: '40px',
        }}
      >
        <div>
          <button
            type="button"
            className="flex items-center font-bold"
            style={{
              fontSize: '24px',
              outline: 'none',
            }}
            onClick={onClickShow}
          >
            <span>
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
        </div>

        <div className="flex items-center">
          <Link href={route}>
            <img
              style={{
                width: '24px',
                marginRight: '4px',
                height: '24px',
              }}
              src="https://cdn0.iconfinder.com/data/icons/web-design-and-development-4/512/180-512.png"
              alt=""
            />
          </Link>
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
                  // key="demo"
                  name="name"
                  className="no-border"
                  placeholder="タスク名"
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
            border: '1px solid white',
            borderRadius: '10px',
          }}
        >
          <div className="flex items-center justify-end px-5">
            <div className="w-full items-center">
              <div className=" my-2 flex items-center">

                <span style={{ marginRight: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>役割</span>

                <Button
                  name="reviewer"
                  onClick={handleSelectReviewer}
                  className={`border-0 mx-4 ${optionReviewer === 'すべて' ? 'option-active' : ''
                  }`}
                >
                  すべて
                </Button>
                <Button
                  name="reviewer"
                  onClick={handleSelectReviewer}
                  className={`border-0 mx-4 ${optionReviewer === '担当者' ? 'option-active' : ''
                  }`}
                >
                  担当者
                </Button>
                <Button
                  name="reviewer"
                  onClick={handleSelectReviewer}
                  className={`border-0 mx-4 ${optionReviewer === 'レビュアー'
                    ? 'option-active' : ''
                  }`}
                >
                  レビュアー
                </Button>

              </div>
              <div className="flex items-center">

                <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>期限日</span>

                <Button
                  name="status"
                  onClick={handleSelectStatus}
                  className={`border-0 mx-4 ${optionStatus === 'すべて' ? 'option-active' : ''
                  }`}
                >
                  すべて
                </Button>
                <Button
                  name="status"
                  onClick={handleSelectStatus}
                  className={`border-0 mx-4 ${optionStatus === '未着手' ? 'option-active' : ''
                  }`}
                >
                  未着手
                </Button>
                <Button
                  name="status"
                  onClick={handleSelectStatus}
                  className={`border-0 mx-4 ${optionStatus === '進行中' ? 'option-active' : ''
                  }`}
                >
                  進行中
                </Button>
                <Button
                  name="status"
                  onClick={handleSelectStatus}
                  className={`border-0 mx-4 ${optionStatus === '今まで' ? 'option-active' : ''
                  }`}
                >
                  今まで
                </Button>
                <Button
                  name="status"
                  onClick={handleSelectStatus}
                  className={`border-0 mx-4 ${optionStatus === '期限きれ' ? 'option-active' : ''
                  }
                    `}
                  style={{ letterSpacing: '-1px' }}
                >
                  <span> 期限きれ </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Table data */}
          <div style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', marginTop: '10px' }}>
            <Table
              scroll={{ y: 645, x: 243 }}
              pagination={false}
              dataSource={list.reverse()}
              columns={newDataColumn}
              loading={{ spinning: isLoading, indicator: loadingIcon }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

TaskSubTable.propTypes = {
  searchIcon: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  taskReviewerList: PropTypes.array.isRequired,
  dataColumn: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  route: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default TaskSubTable
