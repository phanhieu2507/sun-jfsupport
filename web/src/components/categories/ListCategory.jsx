/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useContext, useEffect, useState, useRef } from 'react'
import { ReactReduxContext } from 'react-redux'
import 'antd/dist/antd.css'
import { Input, Space, Table, Row, Col, Select, Button, Tooltip, Empty } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { loadingIcon } from '../loading'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'
import DeleteCategory from './DeleteCategory'
import { getCategories, searchCategory } from '../../api/category'
import './style.scss'

export default function ListCategories() {
  const [pageS, setPageS] = useState(10)
  const { store } = useContext(ReactReduxContext)
  const [category, setCategory] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const role = store.getState().get('auth').get('user').get('role')
  const ref = useRef()
  const [loading, setLoading] = useState(true)

  // search data with key
  async function fetch(key) {
    if (key) {
      searchCategory(key).then((res) => {
        const result = Object.values(res.data)
        setCategory(result)
      })
    } else {
      // setReload(true)
      getCategories().then((res) => {
        setCategory(res.data)
      })
    }
    setSearchValue(key)
  }

  useEffect(() => {
    getCategories().then((res) => {
      setCategory(res.data)
    })
    setLoading(false)
  }, [])

  const reloadPage = () => {
    getCategories().then((res) => {
      setCategory(res.data)
    })
  }
  // table columns
  const columns = [
    {
      key: '1',
      title: 'カテゴリー名',
      dataIndex: 'name',
      width: `${role === 'superadmin' ? '90%' : '100%'}`,
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <div>
          <Tooltip placement="top" title={name}>
            <a>{name}</a>
          </Tooltip>
        </div>
      ),
    },
    {
      key: '2',
      title: `${role === 'superadmin' ? 'アクション' : ''}`,
      width: `${role === 'superadmin' ? '10%' : '0%'}`,
      render: (record) => role === 'superadmin' && (
        <Space size="middle">
          <EditCategory record={record} reloadPage={reloadPage} role={role} />
          <DeleteCategory record={record} reloadPage={reloadPage} role={role} />
        </Space>
      ),
    },
  ]

  const [data, setData] = useState([])
  useEffect(() => {
    setData(
      category.map((element) => ({
        key: element.id,
        id: element.id,
        name: element.category_name,
      })),
    )
  }, [category])
  return (
    <div className="list-category">

      <div className="list">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center content-center text-center pr-3">
              <span>表示件数 </span>
            </div>
            <div className="flex items-center content-center text-center">
              <Select
                className="no-border"
                size="large"
                labelInValue
                defaultValue={{ value: '10' }}
                onChange={(e) => setPageS(e.value)}
              >
                <Select.Option value="10">10</Select.Option>
                <Select.Option value="25">25</Select.Option>
                <Select.Option value="50">50</Select.Option>
              </Select>
            </div>
          </div>
          <div>
            <div className="right-6 no-border">
              <Space direction="vertical">
                <div ref={ref}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div className="flex items-center mr-3">
                      <span className="queue-demo">
                        <span>
                          <Input
                            placeholder="カテゴリを検索"
                            onChange={(e) => fetch(e.target.value)}
                            value={searchValue}
                            bordered
                            prefix={<SearchOutlined />}
                          />
                        </span>
                      </span>
                    </div>
                    <div className="add">
                      {role === 'superadmin' && <AddCategory reloadPage={reloadPage} role={role} />}
                    </div>
                  </div>
                </div>
              </Space>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: pageS }}
          className="mt-5"
          loading={{ spinning: loading, indicator: loadingIcon }}
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
  )
}
