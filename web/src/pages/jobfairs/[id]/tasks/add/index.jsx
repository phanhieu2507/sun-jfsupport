import axios from 'axios'
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Select, Space, Table, notification } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import addTaskAPI from '../../../../../api/add-task'
import OtherLayout from '../../../../../layouts/layout-task'
import Loading from '../../../../../components/loading'
import './style.scss'

function index() {
  const router = useRouter()
  const [listCatergories, setlistCatergories] = useState([])
  const [listMilestones, setlistMilestones] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [temperaryData, setTemperaryData] = useState([])
  const [templateTaskSelect, setTemplateTaskSelect] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobfair, setJobfair] = useState([])
  const [category, setCategory] = useState('')
  const [milestone, setMilestone] = useState('')
  const [valueSearch, setValueSearch] = useState('')
  // route function handle all route in this page.
  const routeTo = async (url) => {
    router.prefetch(url)
    router.push(url)
  }
  // add data of table
  const addDataOfTable = (response) => {
    const data = []
    if (response) {
      for (let i = 0; i < response.data.length; i += 1) {
        const categoryName = []
        for (let j = 0; j < response.data[i].categories.length; j += 1) {
          categoryName.push(response.data[i].categories[j].category_name)
        }
        data.push({
          key: response.data[i].id,
          templateTaskName: response.data[i].name,
          category_name: categoryName,
          milestone_name: response.data[i].milestone.name,
        })
      }
      setTemperaryData(data)
      setOriginalData(data)
    }
  }
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        // TODO: optimize this one by using axios.{all,spread}
        const info = await addTaskAPI.getJobfair(router.query.id)
        const categories = await addTaskAPI.getCategories()
        const milestones = await addTaskAPI.getMilestones()
        const tasks = await addTaskAPI.getAllTemplateTasksNotAdded(
          router.query.id,
        )
        setlistCatergories(categories.data)
        setlistMilestones(Array.from(milestones.data))
        setJobfair(info.data)
        addDataOfTable(tasks)
        setLoading(false)
        return null
      } catch (error) {
        if (error.response.status === 404) {
          routeTo('/404')
        } else return Error('内容が登録されません。よろしいですか？')
        return null
      }
    }
    fetchAPI()
  }, [])

  const columns = [
    {
      title: 'タスク名',
      // width: 100,
      dataIndex: 'templateTaskName',
      fixed: 'left',
    },
    {
      title: 'カテゴリ',
      dataIndex: 'category_name',
      fixed: 'left',
      render: (categoryName) => (
        <div className="">
          {categoryName.length > 0 ? categoryName.join(', ') : ''}
        </div>
      ),
    },
    {
      title: 'マイルストーン',
      dataIndex: 'milestone_name',
    },
  ]
  const searchDataOnTable = (value) => {
    const filteredData = originalData.filter(
      (templateTask) => (value
        ? templateTask.templateTaskName.toLowerCase().includes(value)
        : templateTask.templateTaskName)
        && (category
          ? !templateTask.category_name.includes(category)
          : templateTask.category_name)
        && (milestone
          ? !templateTask.milestone_name.localeCompare(milestone)
          : templateTask.milestone_name),
    )
    setTemperaryData(filteredData)
  }
  const onSearch = (e) => {
    const currValue = e.target.value.toLowerCase()
    setValueSearch(currValue)
    searchDataOnTable(currValue)
  }
  const handleSelectCategory = (value) => {
    setCategory(value)
    const filteredData = originalData.filter(
      (templateTask) => (value
        ? templateTask.category_name.includes(value)
        : templateTask.category_name)
        && (valueSearch
          ? templateTask.templateTaskName.toLowerCase().includes(valueSearch)
          : templateTask.templateTaskName)
        && (milestone
          ? !templateTask.milestone_name.localeCompare(milestone)
          : templateTask.milestone_name),
    )
    setTemperaryData(filteredData)
  }

  const handlSelectMilestone = (value) => {
    setMilestone(value)
    const filteredData = originalData.filter(
      (templateTask) => (value
        ? !templateTask.milestone_name.localeCompare(value)
        : templateTask.milestone_name)
        && (valueSearch
          ? templateTask.templateTaskName.toLowerCase().includes(valueSearch)
          : templateTask.templateTaskName)
        && (category
          ? !templateTask.category_name.includes(category)
          : templateTask.category_name),
    )
    setTemperaryData(filteredData)
  }
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setTemplateTaskSelect(selectedRowKeys)
    },
  }

  const cancelConfirmModle = () => {
    if (!templateTaskSelect.length) {
      routeTo(`/jobfairs/${jobfair.id}/tasks`)
    } else {
      Modal.confirm({
        title: '入力内容が保存されません。よろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk: () => {
          // onFormReset()
          routeTo(`/jobfairs/${jobfair.id}/tasks`)
        },
        onCancel: () => {},
        okText: 'はい',
        centered: true,
        cancelText: 'いいえ',
      })
    }
  }
  const saveNotification = () => {
    notification.success({
      duration: 3,
      message: '正常に登録されました。',
      onClick: () => {},
    })
  }
  const addTask = async () => {
    if (templateTaskSelect) {
      try {
        const data = { data: templateTaskSelect }
        const response = await addTaskAPI.addTasks(jobfair.id, data)
        if (response.status < 299) {
          routeTo(`/jobfairs/${jobfair.id}/tasks`)
          saveNotification()
        } else {
          // setdisableBtn(false)
        }
        return response
      } catch (error) {
        if (error.response.status === 404) {
          routeTo('/404')
        }
        return error
      }
    }
    return ''
  }
  return (
    <div>
      <Loading loading={loading} overlay={loading} />
      <OtherLayout id={router.query.id} bgr={2}>
        <OtherLayout.Main>
          <h1>夕スク登録</h1>
          <div className="add-task-page">
            <div className="container mx-auto w-3/4">
              <div className="grid grid-cols-1 grid-flow-row justify-center">
                {/* task header */}
                <div
                  className="header flex justify-between mb-6 "
                  style={{ flex: '0 0 100%' }}
                >
                  <div className="flex space-x-2" style={{ flex: '0 0 70%' }}>
                    <Select
                      size="large"
                      showArrow
                      allowClear
                      className="w-1/3"
                      placeholder="カテゴリ"
                      onChange={handleSelectCategory}
                    >
                      {listCatergories.map((element) => (
                        <Select.Option
                          key={element.id}
                          value={element.category_name}
                        >
                          {element.category_name}
                        </Select.Option>
                      ))}
                    </Select>
                    <Select
                      size="large"
                      showArrow
                      allowClear
                      onChange={handlSelectMilestone}
                      className="w-1/3"
                      placeholder="マイルストーン"
                      //   onChange={filterSelectedTasks}
                    >
                      {listMilestones.map((element) => (
                        <Select.Option key={element.id} value={element.name}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="search-input no-border">
                    <Input
                      size="large"
                      className="search-input text-base"
                      allowClear="true"
                      prefix={<SearchOutlined />}
                      placeholder="テンプレートタスク名"
                      onChange={onSearch}
                    />
                  </div>
                </div>
                {/* list body */}
                <div className="list-task rounded-sm border border-gray-300 mb-8">
                  <Table
                    rowSelection={rowSelection}
                    pagination={false}
                    columns={columns}
                    dataSource={temperaryData}
                    scroll={{ y: 480 }}
                  />
                </div>
                {/* 2 button */}
                <div className="flex justify-end">
                  <Space size={20}>
                    <Button
                      size="large"
                      htmlType="button"
                      className="ant-btn"
                      onClick={cancelConfirmModle}
                      // disabled={disableBtn}
                      // loading={disableBtn}
                    >
                      キャンセル
                    </Button>
                    {/* --------------------------- */}
                    <Button
                      size="large"
                      type="primary"
                      htmlType="submit"
                      onClick={addTask}
                      // disabled={disableBtn}
                      // loading={disableBtn}
                      style={{ letterSpacing: '-1px' }}
                    >
                      登録
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}

index.getInitialProps = async (ctx) => {
  const jobfairId = parseInt(ctx.query.id, 10)
  const userId = ctx.store.getState().get('auth').get('user').get('id')
  if (userId) {
    try {
      await axios.get(`${ctx.serverURL}/is-admin-jobfair`, {
        params: { userId, jobfairId },
      })
    } catch (err) {
      ctx.res?.writeHead(302, { Location: '/top-page?error=403' })
      ctx.res?.end()
    }
  }
  return {}
}
index.middleware = ['auth:member']
export default index
