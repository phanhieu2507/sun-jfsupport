import React, { useState, useEffect, useRef } from 'react'
import { Form, Button, notification, Select, Tag, Tooltip, Space, Switch } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Link from 'next/link'
import OtherLayout from '../../../../layouts/OtherLayout'
import ItemInput from '../../../../components/template-task-edit/form-item/input'
import CancelEditTemplateTask from '../../../../components/CancelEditTemplateTask'
import ItemDropdow from '../../../../components/template-task-edit/form-item/dropdown'
import Effort from '../../../../components/template-task-edit/form-item/effort'
import { getTaskList } from '../../../../api/template-task'
import {
  getCategoryData,
  getTemplateTask,
  getMilestoneData,
  getNextTasks,
  getPrevTasks,
  updateTemplateTask,
  getTemplateTasksList,
  getBeforeAndAfterTemplateTask,
} from '../../../../api/template-task-edit'
import './style.scss'
// import MarkDownView from '../../../../components/markDownView'
// import Editor from '../../../../components/comment/Editor'
const Editor = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('../../../../components/editor'),
  { ssr: false },
)

const unitData = [
  { id: 1, name: '学生数', submit: 'students' },
  { id: 2, name: '企業数', submit: 'companies' },
  { id: 3, name: 'None', submit: 'none' },
]

const isDayData = [
  { id: 0, name: '時間' },
  { id: 1, name: '日' },
]

const EditTemplateTaskPage = () => {
  const isMounted = useRef(false)
  const [milestoneId, setMilestoneId] = useState()
  const [isDay, setIsDay] = useState(0)
  const [unit, setUnit] = useState('')
  const [description, setDescription] = useState('')
  const [pathId, setPathId] = useState('')
  const [categoryData, setCategoryData] = useState([])
  const [milestoneData, setMilestoneData] = useState([])
  const [templateTaskNameInput, setTemplateTaskNameInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [milestoneInput, setMilestoneInput] = useState('')
  const [effortNumber, setEffortNumber] = useState('')
  const [form] = Form.useForm()
  const [checkSpace, setCheckSpace] = useState(false)
  const router = useRouter()
  const [allTask, setAllTask] = useState([])
  const [beforeTasksNew, setBeforeTaskNew] = useState([])
  const [afterTasksNew, setafterTaskNew] = useState([])
  const [confilm, setConfilm] = useState(false)
  const [oldTaskName, setOldTaskName] = useState('')
  const taskId = router.query.id

  // eslint-disable-next-line no-unused-vars
  let tasksList = []

  const getListTPL = async () => {
    await getTemplateTasksList()
      .then((res) => {
        tasksList = [...res.data]
        const data = res.data.filter((e) => e.name !== oldTaskName)
        setAllTask(data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const getTemplateNameList = async () => {
    await getTaskList().then((res) => {
      const temp = []
      for (let i = 0; i < res.data.length; i += 1) {
        temp.push({
          id: res.data[i].id,
          name: res.data[i].name,
        })
      }
    }).catch((error) => {
      if (error.response.status === 404) {
        router.push('/404')
      }
    })
  }

  const fetchPrevTasks = async (id, FilterSameAfter) => {
    await getPrevTasks(id)
      .then((res) => {
        const value = []
        res.data.before_tasks.forEach((item) => value.push(item.name))
        form.setFieldsValue({
          taskBefore: value,
        })
        const data = FilterSameAfter?.filter((item) => !value.includes(item.name))
        setafterTaskNew(data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const fetchNextTasks = async (id, FilterSameBefore) => {
    await getNextTasks(id)
      .then((res) => {
        const value = []
        res.data.after_tasks.forEach((item) => value.push(item.name))
        form.setFieldsValue({
          afterTask: value,
        })
        const data = FilterSameBefore?.filter((item) => !value.includes(item.name))
        setBeforeTaskNew(data)
      }).catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const getListTemplateTaskBeforeAndAfter = async (id, name) => {
    await getBeforeAndAfterTemplateTask(id)
      .then((res) => {
        const FilterSameBefore = res?.data?.listTemplateTaskBefores?.filter((item) => item.name !== name)
        const FilterSameAfter = res?.data?.listTemplateTaskAfters?.filter((item) => item.name !== name)
        // setBeforeTaskNew(FilterSameBefore)
        // setafterTaskNew(FilterSameAfter)
        const temp = /[/](\d+)[/]/.exec(window.location.pathname)
        const ids = `${temp[1]}`
        fetchPrevTasks(ids, FilterSameAfter)
        fetchNextTasks(ids, FilterSameBefore)
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          router.push('/404')
        }
      })
  }

  const fetchTemplateTask = async (id) => {
    await getTemplateTask(id)
      .then((res) => {
        setTemplateTaskNameInput(res.data.name)
        setOldTaskName(res.data.name)
        getListTemplateTaskBeforeAndAfter(res?.data?.milestone_id, oldTaskName)
        let categoryName = []
        if (res.data.categories.length > 0) {
          setCategoryInput(res.data.categories[0].category_name)
          res.data.categories.forEach((element) => {
            categoryName.push(element.category_name)
          })
        } else {
          categoryName = ''
        }
        setMilestoneInput(res.data.milestone.name)
        setMilestoneId(res.data.milestone.id)
        setDescription(res.data.description_of_detail)
        setEffortNumber(res.data.effort)
        if (res.data.unit === 'students') {
          setUnit('学生数')
        } else if (res.data.unit === 'companies') {
          setUnit('企業数')
        } else {
          setUnit('none')
        }
        setIsDay(res.data.is_day)
        form.setFieldsValue({
          templateTaskName: res.data.name,
          category: categoryName,
          milestone: res.data.milestone.name,
          // description: res.data.description_of_detail,
          effort: res.data.effort,
          unit:
            // eslint-disable-next-line no-nested-ternary
            res.data.unit === 'students'
              ? '学生数'
              : res.data.unit === 'companies'
                ? '企業数'
                : 'none',
          is_day: isDayData[res.data.is_day].name,
          duplicate_button: res.data.is_duplicated,
        })
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const fetchCategoryData = async () => {
    await getCategoryData()
      .then((res) => {
        setCategoryData(res.data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const fetchMilestoneData = async () => {
    await getMilestoneData()
      .then((res) => {
        setMilestoneData(res.data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const openNotificationSuccess = () => {
    if (
      templateTaskNameInput !== ''
      && categoryInput !== ''
      && milestoneInput !== ''
      && effortNumber !== 0
      && checkSpace === false
    ) {
      notification.success({
        message: '変更は正常に保存されました。',
        duration: 3,
      })
    }
  }

  useEffect(async () => {
    const temp = /[/](\d+)[/]/.exec(window.location.pathname)
    const id = `${temp[1]}`

    setPathId(id)
    fetchTemplateTask(id)
    fetchCategoryData()
    fetchMilestoneData()
    getListTPL()
    getTemplateNameList()
  }, [])

  const handleOk = async (values) => {
    const beforeID = []
    const afterIDs = []
    const idCategory = []
    if (values.category) {
      categoryData.map((item) => {
        if (values.category.includes(item.category_name)) {
          idCategory.push(item.id)
        }
        return ''
      })
    }
    if (values.taskBefore && values.afterTask) {
      // eslint-disable-next-line array-callback-return
      allTask.map((e) => {
        if (values.taskBefore.includes(e.name)) {
          beforeID.push(e.id)
        }
        if (values.afterTask.includes(e.name)) {
          afterIDs.push(e.id)
        }
      })
    }
    const temp = /[/](\d+)[/]/.exec(window.location.pathname)
    const id = `${temp[1]}`
    const coUnit = unitData.find((o) => o.name === unit)?.submit
    await updateTemplateTask(id, {
      name: templateTaskNameInput,
      description_of_detail: description,
      milestone_id: milestoneId,
      is_day: isDay,
      unit: coUnit,
      effort: effortNumber,
      category_id: idCategory,
      beforeTasks: beforeID,
      afterTasks: afterIDs,
    })
      .then(() => {
        router.push(`/template-tasks/${id}`)
        setTimeout(() => {
          openNotificationSuccess()
        }, 1000)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
        if (error.response.status === 400) {
          if (error.response.data?.error) {
            notification.error({
              message: '前のタスクまたは次のタスクは正しくないので、確認してみてください。',
              duration: 3,
            })
          }
        }
        if (JSON.parse(error.response.request.response).message === 'duplicated name') {
          notification.error({
            message: 'このテンプレートタスク名は存在しています',
            duration: 3,
          })
        }
      })
  }
  const categoryValidator = (_, value) => {
    if (!value || value.length === 0) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    return Promise.resolve()
  }
  const templateTaskClassification = (tempList) => {
    let tmpResult = {}
    if (tempList.length > 0) {
      tempList.map((item) => {
        const key = `${item?.milestone_id}`
        if (key in tmpResult) {
          tmpResult = { ...tmpResult, [key]: [...tmpResult[key], item] }
        } else {
          tmpResult = { ...tmpResult, [key]: [item] }
        }
        return item
      })
    }

    const result = []
    Object.keys(tmpResult).map((i) => {
      const mil = milestoneData.filter((m) => `${m.id}` === i)[0]
      result.push({
        ...mil,
        templateTasks: tmpResult[i],
      })
      return i
    })
    return result
  }
  const truncates = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const tagRender = (props) => {
    // eslint-disable-next-line react/prop-types
    const { label, closable, value, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    const id = allTask.find((e) => e.name === value)
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, paddingTop: '5px', paddingBottom: '3px' }}
      >
        <Tooltip title={label}>
          {id ? (
            <a
              target="_blank"
              href={`/template-tasks/${id.id}`}
              className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden"
              rel="noreferrer"
            >
              {truncates(label)}
            </a>
          ) : (
            <a
              target="_blank"
              className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden"
              rel="noreferrer"
            >
              {truncates(label)}
            </a>
          )}
        </Tooltip>
      </Tag>
    )
  }
  const filtedArr = () => {
    setConfilm(true)
    const before = form.getFieldsValue().taskBefore
    const after = form.getFieldsValue().afterTask
    let selectedItems = []
    if (before && !after) {
      selectedItems = [...selectedItems, ...before]
    } else if (!before && after) {
      selectedItems = [...selectedItems, ...after]
    } else if (before && after) {
      selectedItems = [...before, ...after]
    }
    const filted = allTask.filter((e) => !selectedItems.includes(e.name))
    setBeforeTaskNew(filted)
    setafterTaskNew(filted)
    return filted
  }
  const [isPreview, setIsPreview] = useState(false)
  const [dataPreview, setDataPreview] = useState([])
  const [chosePreview, setChosePreview] = useState(false)
  const checkIsFormInputNotEmpty = () => {
    // get all input values .
    const inputValues = form.getFieldsValue()
    //  return type :[]
    const inputs = Object.values(inputValues)

    for (let i = 0; i < inputs.length; i += 1) {
      const element = inputs[i]
      if (!element) {
        return false
      }
    }
    return true
  }
  const onFinishFail = () => {
    setChosePreview(false)
  }
  const onPreview = () => {
    setChosePreview(false)
    if (checkIsFormInputNotEmpty) {
      setIsPreview(true)
      const data = {
        name: templateTaskNameInput,
        description_of_detail: description,
        milestone: milestoneInput,
        is_day: isDayData[isDay].name,
        unit,
        effort: effortNumber,
        category: categoryInput,
      }
      setDataPreview(data)
    }
  }
  useEffect(async () => {
    if (isMounted.current) {
      const temp = /[/](\d+)[/]/.exec(window.location.pathname)
      const id = `${temp[1]}`
      await getTemplateTask(id).then((res) => {
        setOldTaskName(res.data.name)
        getListTemplateTaskBeforeAndAfter(milestoneId, oldTaskName)
      })
    } else {
      isMounted.current = true
    }
  }, [milestoneId])
  return (
    <div>
      <OtherLayout>
        <OtherLayout.Main>
          <Link href={`/template-tasks/${taskId}`}>
            <ArrowLeftOutlined className="back-button" />
          </Link>
          <div className="edit-template-task">
            <h1>テンプレートタスク編集</h1>
            <div className="h-screen flex flex-col items-center pt-10 bg-white my-8">
              <Form
                form={form}
                name="basic"
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 16,
                }}
                className="space-y-12 w-5/6"
                onFinish={chosePreview ? onPreview : handleOk}
                onFinishFailed={onFinishFail}
              >
                <div className="grid grid-cols-2">
                  <div className="col-span-1 ml-8">
                    <Form.Item label="テンプレートタスク名" required={!isPreview}>
                      <ItemInput
                        form={form}
                        name="templateTaskName"
                        setConfilm={setConfilm}
                        setCheckSpace={setCheckSpace}
                        setInput={setTemplateTaskNameInput}
                        display={isPreview}
                        oldTaskName={oldTaskName}
                      />
                      <p style={{ display: isPreview ? '' : 'none' }}>{dataPreview.name}</p>
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item
                      label="カテゴリ"
                      name="category"
                      className="tag_a"
                      required={!isPreview}
                      rules={[
                        { validator: categoryValidator },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        showArrow
                        tagRender={tagRender}
                        style={{ width: '100%' }}
                      >
                        {categoryData.map((element) => (
                          <Select.Option key={element.category_name} value={element.category_name}>
                            {element.category_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item label="マイルストーン" required={!isPreview}>
                      <ItemDropdow
                        setConfilm={setConfilm}
                        form={form}
                        name="milestone"
                        setCheckSpace={setCheckSpace}
                        data={milestoneData}
                        setInput={setMilestoneInput}
                        setId={setMilestoneId}
                        display={isPreview}
                      />
                      <p style={{ display: isPreview ? '' : 'none' }}>{dataPreview.milestone}</p>
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item label="工数" required={!isPreview}>
                      <Effort
                        setConfilm={setConfilm}
                        form={form}
                        unitData={unitData}
                        isDayData={isDayData}
                        setCheckSpace={setCheckSpace}
                        setInput={setEffortNumber}
                        setUnit={setUnit}
                        setIsDay={setIsDay}
                        display={isPreview}
                      />
                      <p style={{ display: isPreview ? '' : 'none' }}>
                        {dataPreview.effort}
                        {' '}
                        &nbsp;
                        {dataPreview.is_day}
                        /
                        {dataPreview.unit}
                      </p>
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item label="前のタスク" name="taskBefore" className="tag_a">
                      <Select
                        mode="multiple"
                        showArrow
                        tagRender={tagRender}
                        style={{ width: '100%' }}
                        onChange={filtedArr}
                      >
                        {beforeTasksNew.length > 0 && templateTaskClassification(beforeTasksNew)?.map((element) => (
                          <Select.OptGroup label={element.name}>
                            {
                              element.templateTasks.map((tt) => (
                                <Select.Option key={tt.id} value={tt.name}>
                                  {tt.name}
                                </Select.Option>
                              ))
                            }
                          </Select.OptGroup>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item label="次のタスク" name="afterTask" className="tag_a">
                      <Select
                        mode="multiple"
                        showArrow
                        tagRender={tagRender}
                        style={{ width: '100%' }}
                        onChange={filtedArr}
                      >
                        {afterTasksNew.length > 0 && templateTaskClassification(afterTasksNew)?.map((element) => (
                          <Select.OptGroup label={element.name}>
                            {
                              element.templateTasks.map((tt) => (
                                <Select.Option key={tt.id} value={tt.name}>
                                  {tt.name}
                                </Select.Option>
                              ))
                            }
                          </Select.OptGroup>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item label="タスクの複製" name="duplicate_button">
                      <Switch className="switch-btn" />
                    </Form.Item>
                  </div>
                </div>
                <div
                  className="mr-4 2xl:mr-10 pl-12 mb-2"
                >
                  <Editor
                    editorText={description}
                    setEditorText={setDescription}
                    readOnly={isPreview}
                    fileSelect={{
                      state: false,
                      fileData: [],
                    }}
                  />
                </div>
                <div className="flex justify-end -mr-32">
                  <Form.Item>
                    <Space
                      size={20}
                      className="flex place-content-end"
                      style={{ display: isPreview ? 'none' : '' }}
                    >
                      <CancelEditTemplateTask confilm={confilm} id={pathId} />
                      <Button
                        className="preview_btn"
                        htmlType="submit"
                        onClick={() => {
                          setChosePreview(!chosePreview)
                        }}
                        style={{ letterSpacing: '-1px' }}
                      >
                        プレビュー
                      </Button>
                      <Button type="primary" htmlType="submit" className="text-base mr-5 2xl:mr-10">
                        <span> 保存 </span>
                      </Button>
                    </Space>
                    <div style={{ display: isPreview ? '' : 'none' }} className="mr-40">
                      <Space size={20}>
                        <Button
                          htmlType="button"
                          onClick={() => {
                            setIsPreview(false)
                          }}
                          style={{ letterSpacing: '-1px' }}
                        >
                          編集
                        </Button>
                        <Button type="primary" htmlType="submit" className="text-base ">
                          <span> 保存 </span>
                        </Button>
                      </Space>
                    </div>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}

EditTemplateTaskPage.middleware = ['auth:superadmin']
export default EditTemplateTaskPage
