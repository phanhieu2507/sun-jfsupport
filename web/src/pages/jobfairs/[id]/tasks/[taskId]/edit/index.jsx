import axios from 'axios'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ExclamationCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Modal, notification, Select, Tag, Tooltip } from 'antd'
import { editTask, listReviewersSelectTag, listTaskBeforeAndAfter, reviewers, getCategorys } from '../../../../../../api/edit-task'
import { jftask } from '../../../../../../api/jf-toppage'
import { afterTask, beforeTask, getUserByCategory, taskData } from '../../../../../../api/task-detail'
import { webInit } from '../../../../../../api/web-init'
// import Editor from '../../components/comment/Editor'
import Loading from '../../../../../../components/loading'
import JfLayout from '../../../../../../layouts/layout-task'
import * as Extensions from '../../../../../../utils/extensions'
import './style.scss'

const Editor = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('../../../../../../components/editor'),
  { ssr: false },
)
function EditTask() {
  const dateFormat = 'YYYY/MM/DD'
  const router = useRouter()
  const idTask = router.query.taskId
  const [form] = Form.useForm()
  const [disableBtn, setdisableBtn] = useState(false)
  const [assign, setAssign] = useState(true)
  const [beforeTasksNew, setBeforeTaskNew] = useState([])
  const [listUser, setListUser] = useState([])
  const [allTask, setAllTask] = useState([])
  const [afterTasksNew, setafterTaskNew] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [reviewersSelected, setReviewersSelected] = useState([])
  const [milestoneData, setMilestoneData] = useState([])
  const [users, setUsers] = useState({
    id: null,
    name: '',
    role: '',
  })
  // const [jfID, setJfID] = useState('')
  const [infoTask, setInfoTask] = useState({
    name: '',
    categories: '',
    milestone: '',
    status: '',
    start_time: '',
    end_time: '',
    effort: '',
    is_day: null,
    unit: '',
    description_of_detail: '',
  })

  const [loading, setLoading] = useState(true)
  const [jfId, setIdJF] = useState(null)
  const [reviewerName, setReviewerName] = useState([])
  const [reviewersSelectTag, setReviewersSelectTag] = useState([])
  const [countUserAs, setCountUserAs] = useState(null)
  const [description, setDescription] = useState('')

  const fetchTaskData = async () => {
    await reviewers(idTask)
      .then((response) => {
        if (response.status === 200) {
          const idReviewer = []
          const nameReviewer = []
          response.data.forEach((element) => {
            idReviewer.push(element.id)
            reviewerName.push(element.name)
          })
          if (idReviewer.length === 0) idReviewer.push('なし')
          setReviewersSelected(idReviewer)
          setReviewerName(nameReviewer)
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          router.push('/404')
        }
      })

    await listReviewersSelectTag(idTask)
      .then((response) => {
        if (response.status === 200) {
          setReviewersSelectTag(response.data)
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const fetchBeforeTask = async (dataBefore) => {
    await beforeTask(idTask)
      .then((response) => {
        const listbfTask = []
        response.data.before_tasks.forEach((element) => {
          listbfTask.push(element.name)
        })
        form.setFieldsValue({
          taskBefore: listbfTask,
        })
        const data = dataBefore?.filter((item) => !listbfTask.includes(item.name))
        setBeforeTaskNew(data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const fetchMilestoneData = async () => {
    await getCategorys()
      .then((res) => {
        setMilestoneData(res.data)
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          router.push('/404')
        }
      })
  }
  const fetchafterTask = async (dataAfter) => {
    await afterTask(idTask)
      .then((response) => {
        const listatTask = []
        response.data.after_tasks.forEach((element) => {
          listatTask.push(element.name)
        })
        form.setFieldsValue({
          afterTask: listatTask,
        })
        const data = dataAfter?.filter((item) => !listatTask.includes(item.name))
        setafterTaskNew(data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const fetchListTask = async (FilterSameAfter, FilterSameBefore, idJF) => {
    await jftask(idJF)
      .then((response) => {
        const notSelectedTask = response.data.schedule.tasks.filter(
          (task) => task.name !== infoTask.name,
        )
        const value = []
        response.data.schedule.tasks.forEach((item) => value.push(item.name))
        const dataBefore = FilterSameBefore?.filter((item) => !item.name.includes(value))
        const dataAfter = FilterSameAfter?.filter((item) => !item.name.includes(value))
        setAllTask(notSelectedTask)
        fetchBeforeTask(dataBefore)
        fetchafterTask(dataAfter)
      })
      .catch((err) => {
        if (err.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const getListTaskBeforeAndAfter = async (id, name, idJF) => {
    await listTaskBeforeAndAfter(id)
      .then((res) => {
        const FilterSameBefore = res?.data?.listTaskBefores?.filter((item) => item.name !== name)
        const FilterSameAfter = res?.data?.listTaskAfters?.filter((item) => item.name !== name)
        fetchListTask(FilterSameAfter, FilterSameBefore, idJF)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }
  const dataTask = async () => {
    await taskData(idTask)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data
          getListTaskBeforeAndAfter(data.milestone.id, data.name, data.schedule.jobfair.id)
          const categoryName = []
          response.data.categories.forEach((element) => {
            categoryName.push(element.category_name)
          })
          setInfoTask({
            name: data.name,
            categories: categoryName,
            milestone: data.milestone.name,
            status: data.status,
            start_time: data.start_time,
            end_time: data.end_time,
            effort: data.template_task.effort,
            is_day: data.template_task.is_day,
            unit: data.template_task.unit,
            description_of_detail: data.description_of_detail || '',
          })
          // setJfID(response.data.schedule.jobfair.id)
          setIdJF(data.schedule.jobfair.id)
          setDescription(data.description_of_detail || '')
          // eslint-disable-next-line no-use-before-define
          // fetchListTask()
          const listmember = []
          data.users.forEach((element) => {
            listmember.push(element.name)
          })
          const listReviewers = [...reviewerName]
          setCountUserAs(listmember)

          form.setFieldsValue({
            name: data.name,
            // category: data.categories[0].category_name,
            milestone: data.milestone.name,
            assignee: listmember,
            status: data.status,
            start_time: moment(data.start_time.split('-').join('/'), dateFormat),
            end_time: moment(data.end_time.split('-').join('/'), dateFormat),
            detail: data.description_of_detail,
            reviewers: listReviewers.length === 0 ? ['なし'] : listReviewers,
          })
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const handleChangeDescription = (value) => {
    setDescription(value)
  }

  const startDayValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    return Promise.resolve()
  }
  const EndDayValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    const startTime = form.getFieldValue('start_time')
    if (value < startTime) {
      return Promise.reject(new Error('終了日は開始日以降で入力してください'))
    }
    return Promise.resolve()
  }
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
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
        <Tooltip title={value}>
          {id ? (
            <a
              target="_blank"
              href={`/jobfairs/${jfId}/tasks/${id.id}`}
              className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden"
              rel="noreferrer"
            >
              {truncate(label)}
            </a>
          ) : (
            <a
              target="_blank"
              className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden"
              rel="noreferrer"
            >
              {truncate(label)}
            </a>
          )}
        </Tooltip>
      </Tag>
    )
  }

  const tagRenderr = (props) => {
    // eslint-disable-next-line react/prop-types
    const { label, closable, onClose } = props
    const nameUser = form.getFieldValue('assignee')
    setCountUserAs(nameUser)
    if (nameUser.length !== 0) {
      document.getElementById('error-user').setAttribute('hidden', 'text-red-600')
      setAssign(true)
      form.setFieldsValue({})
    }
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={() => {
          onClose()
          const nameUsers = form.getFieldValue('assignee')
          if (nameUsers.length === 0) {
            setAssign(false)
            setCountUserAs(null)
            document.getElementById('error-user').removeAttribute('hidden', 'text-red-600')
          }
          if (nameUsers.length !== 0) {
            setAssign(true)
            document.getElementById('error-user').setAttribute('hidden', 'text-red-600')
          }
        }}
        style={{ marginRight: 3, paddingTop: '5px', paddingBottom: '3px' }}
      >
        <Tooltip title={label}>
          <span className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden">
            {label}
          </span>
        </Tooltip>
      </Tag>
    )
  }
  const filtedArr = () => {
    setIsEdit(true)
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
    const filtedBF = beforeTasksNew.filter((e) => !selectedItems.includes(e.name))
    const filtedAT = afterTasksNew.filter((e) => !selectedItems.includes(e.name))
    setBeforeTaskNew(filtedBF)
    setafterTaskNew(filtedAT)
    return filtedBF
  }
  const TaskNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    // if (value.match(Extensions.Reg.specialCharacter)) {
    //   return Promise.reject(new Error('使用できない文字が含まれています'))
    // }
    if (value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('数字のみを含めることはできない'))
    }
    if (value.trim().length === 0) {
      return Promise.reject(new Error('1文字以上の文字を入力してください。'))
    }

    return Promise.resolve()
  }
  // eslint-disable-next-line consistent-return
  const onValueNameChange = (e) => {
    setIsEdit(true)
    form.setFieldsValue({
      name: e.target.value,
    })
    if (e.target.value) {
      document.getElementById('validate_name').style.border = '1px solid #ffd803'
      return document.getElementById('error-msg').setAttribute('hidden', 'text-red-600')
    }

    document.getElementById('validate_name').style.border = '0.5px solid red'
  }

  const onReviewersChange = (value) => {
    const newReviewers = []
    newReviewers.push(value)
    setReviewersSelected(newReviewers)
  }

  const getDataUser = async () => {
    await webInit().then((response) => {
      setUsers({
        id: response.data.auth.user.id,
        name: response.data.auth.user.name,
        role: response.data.auth.user.role,
      })
    })
  }

  const saveNotification = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
      onClick: () => { },
    })
  }

  const forbidNotification = () => {
    notification.error({
      message: 'Method not allowed',
    })
  }
  const openNotification = (type, message, descrip) => {
    notification[type]({
      message,
      descrip,
      duration: 2.5,
    })
  }
  const onFinishSuccess = async (values) => {
    let checkName = false
    // eslint-disable-next-line consistent-return
    allTask.forEach((element) => {
      if (values.name !== infoTask.name) {
        if (values.name === element.name) {
          checkName = true
          document.getElementById('validate_name').style.border = '1px solid red'
          return document.getElementById('error-msg').removeAttribute('hidden', 'text-red-600')
        }
      }
    })
    if (!checkName) {
      try {
        const beforeID = []
        const afterIDs = []
        const adminas = []
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
        if (values.assignee) {
          listUser.map((e) => {
            if (values.assignee.includes(e.name)) {
              adminas.push(e.id)
            }
            return ''
          })
        }

        const data = {
          name: values.name,
          description_of_detail: description.trim(),
          beforeTasks: beforeID,
          afterTasks: afterIDs,
          start_time: values.start_time.format(Extensions.dateFormat),
          end_time: values.end_time.format(Extensions.dateFormat),
          admin: adminas,
          user_id: users.id,
          status: values.status,
          reviewers: reviewersSelected[0] === 'なし' ? [] : reviewersSelected,
        }

        if (data.description_of_detail === '') {
          data.description_of_detail = ' '
        }

        if (countUserAs.length > 1 && reviewersSelected[0] === 'なし') {
          openNotification('error', '複数の担当者を選択する場合にはレビュアーを選択してください')
        } else {
          setdisableBtn(true)
          await editTask(idTask, data)
            .then((response) => {
              router.push(`/jobfairs/${jfId}/tasks/${idTask}`)
              if (response.data.warning === true) {
                notification.warning({
                  duration: 3,
                  message: response.data.message,
                  onClick: () => { },
                })
              } else saveNotification()
            })
            .catch((error) => {
              setdisableBtn(false)
              if (error.response.status === 404) {
                router.push('/404')
              } else
              if (error.response.status === 400) {
                if (error.response.data?.error) {
                  notification.error({
                    message: '前のタスクまたは次のタスクは正しくないので、確認してみてください。',
                  })
                } else {
                  forbidNotification()
                }
              } else {
                forbidNotification()
              }
            })
        }
      } catch (error) {
        setdisableBtn(false)
        if (error.response.status === 404) {
          router.push('/404')
        }
        return error
      }
    }
    return ''
  }

  const onFinishFailed = (errorInfo) => errorInfo
  const cancelConfirmModle = () => {
    if (isEdit === false) {
      router.push(`/jobfairs/${jfId}/tasks`)
    } else {
      Modal.confirm({
        title: '変更内容が保存されません。よろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        centered: true,
        onOk: () => {
          router.push(`/jobfairs/${jfId}/tasks/${idTask}`)
        },

        onCancel: () => { },
        okText: 'はい',
        cancelText: 'いいえ',
      })
    }
  }

  const fetchListMember = async () => {
    let listMember = []
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < infoTask.categories.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await getUserByCategory(infoTask.categories[index])
        // eslint-disable-next-line no-loop-func
        .then((response) => {
          listMember = listMember.concat(response.data)
        })
        .catch((error) => {
          if (error.response.status === 404) {
            router.push('/404')
          }
        })
    }
    setListUser(listMember)
  }
  useEffect(() => {
    setLoading(true)
    dataTask()
    fetchTaskData()
    getDataUser()
    setDescription(infoTask.description_of_detail)
    setLoading(false)
    fetchMilestoneData()
  }, [])
  useEffect(() => {
    fetchListMember()
  }, [infoTask])
  // useEffect(() => {
  //   if (jfId) {
  //     dataTask()
  //   }
  //   setLoading(false)
  // }, [jfId])

  // }, [infoTask])
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setReRender(true)
  //   }, 800)
  //   return () => clearTimeout(timer)
  // }, [infoTask.description_of_detail])
  const listStatus = ['未着手', '進行中', '完了', '中断', '未完了']
  // const onTyping = (value) => {
  //   if (value !== '') {
  //     setInfoTask({ ...infoTask, description_of_detail: value })
  //   }
  // }
  // ant-select-selector
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
  return (
    <div>
      {
        loading && <Loading loading={loading} overlay={loading} />
      }
      <JfLayout id={jfId} bgr={2}>
        <JfLayout.Main>
          <Link href={`/jobfairs/${jfId}/tasks/${idTask}`}>
            <ArrowLeftOutlined
              style={{ position: 'absolute', fontSize: '25px', top: '170px', left: '230px' }}
            />
          </Link>
          <h1>タスク編集 </h1>
          <div className="edit-task">
            <Form
              form={form}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              layout="horizontal"
              colon={false}
              initialValues={{ defaultInputValue: 0 }}
              onFinish={onFinishSuccess}
              onFinishFailed={onFinishFailed}
            >
              <div className="grid grid-cols-2">
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item
                    label="タスク名"
                    name="name"
                    required
                    rules={[
                      {
                        validator: TaskNameValidator,
                      },
                    ]}
                  >
                    <Input
                      id="validate_name"
                      className="validate_name"
                      type="text"
                      placeholder="タスク名を入力する"
                      maxLength={20}
                      size="large"
                      onChange={onValueNameChange}
                    />
                  </Form.Item>
                  <div className="ant-row">
                    <div className="ant-col ant-col-6" />
                    <div className="ant-col ant-col-18">
                      <span
                        id="error-msg"
                        style={{ color: '#ff3860', fontSize: '14px' }}
                        className="text-red-600"
                        hidden
                      >
                        この名前はすでに存在します
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="カテゴリ" name="category">
                    <span>{infoTask.categories ? infoTask.categories.join(', ') : null}</span>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="マイルストーン" name="milestone">
                    <span>{infoTask.milestone}</span>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="工数" name="effort">
                    <div className="row-ef pl-1">
                      {infoTask.unit === 'none' ? (
                        <>
                          <span className="eff">{infoTask.effort}</span>
                          <span className="ef">{infoTask.is_day ? '日' : '時間'}</span>
                        </>
                      ) : (
                        <>
                          <span className="eff">{infoTask.effort}</span>
                          <span className="ef">{infoTask.is_day ? '日' : '時間'}</span>
                          <span>/</span>
                          {infoTask.unit === 'students' ? (
                            <span className="ef">学生数</span>
                          ) : (
                            <span className="ef">企業数</span>
                          )}
                        </>
                      )}
                    </div>
                  </Form.Item>
                </div>

                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item
                    name="start_time"
                    label="開始日"
                    required
                    className="big-icon"
                    rules={[
                      {
                        validator: startDayValidator,
                      },
                    ]}
                  >
                    <DatePicker
                      size="large"
                      onChange={() => {
                        setIsEdit(true)
                      }}
                      help="Please select the correct date"
                      format={Extensions.dateFormat}
                      placeholder={Extensions.dateFormat}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item
                    name="end_time"
                    className="big-icon"
                    label="終了日"
                    required
                    rules={[
                      {
                        validator: EndDayValidator,
                      },
                    ]}
                  >
                    <DatePicker
                      size="large"
                      onChange={() => {
                        setIsEdit(true)
                      }}
                      help="Please select the correct date"
                      format={Extensions.dateFormat}
                      placeholder={Extensions.dateFormat}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="前のタスク" name="taskBefore" className="tag_a">
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%' }}
                      onChange={filtedArr}
                    >
                      {beforeTasksNew.length > 0
                        && templateTaskClassification(beforeTasksNew)?.map(
                          (element) => (
                            <Select.OptGroup label={element.category_name}>
                              {element.templateTasks.map((tt) => (
                                <Select.Option key={tt.id} value={tt.name}>
                                  {tt.name}
                                </Select.Option>
                              ))}
                            </Select.OptGroup>
                          ),
                        )}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="次のタスク" name="afterTask" className="tag_a">
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%' }}
                      onChange={filtedArr}
                    >
                      {afterTasksNew.length > 0
                        && templateTaskClassification(afterTasksNew)?.map(
                          (element) => (
                            <Select.OptGroup label={element.category_name}>
                              {element.templateTasks.map((tt) => (
                                <Select.Option key={tt.id} value={tt.name}>
                                  {tt.name}
                                </Select.Option>
                              ))}
                            </Select.OptGroup>
                          ),
                        )}
                    </Select>
                  </Form.Item>
                </div>

                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item label="担当者" name="assignee" required className="multiples" style={{ marginBottom: '0px' }}>
                    {assign ? (
                      <Select mode="multiple" showArrow tagRender={tagRenderr}>
                        {listUser.map((element) => (
                          <Select.Option
                            className="validate-user"
                            key={element.id}
                            value={element.name}
                          >
                            {element.name}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <Select
                        mode="multiple"
                        showArrow
                        tagRender={tagRenderr}
                        style={{
                          width: '100%',
                          border: '1px solid red',
                          borderRadius: 6,
                        }}
                        className="multiples"
                      >
                        {listUser.map((element) => (
                          <Select.Option
                            className="validate-user"
                            key={element.id}
                            value={element.name}
                          >
                            {element.name}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <div className="ant-row">
                    <div className="ant-col ant-col-6" />
                    <div className="ant-col ant-col-18">
                      <span
                        id="error-user"
                        style={{ color: '#ff3860', fontSize: '14px' }}
                        className="text-red-600"
                        hidden
                      >
                        この項目は必須です
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-2 mb-2">
                  <Form.Item
                    label="ステータス"
                    name="status"
                    required
                    rules={[
                      {
                        validator: TaskNameValidator,
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      onChange={() => {
                        setIsEdit(true)
                      }}
                      className="addJF-selector"
                      placeholder="ステータス"
                    >
                      {listStatus.map((element) => (
                        <Select.Option value={element} key={element}>{element}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div
                  style={{ display: 'block' }}
                  className="col-span-1 mx-2 mb-2"
                >
                  <Form.Item label="レビュアー" name="reviewers" className="tag_a">
                    <Select
                      showArrow
                      size="large"
                      tagRender={tagRender}
                      style={{ width: '100%', transition: '0' }}
                      onChange={onReviewersChange}
                    >
                      <Select.Option
                        className="validate-user"
                        key={0}
                        value="なし"
                      >
                        なし
                      </Select.Option>
                      {reviewersSelectTag.map((element) => (
                        <Select.Option
                          className="validate-user"
                          key={element.id}
                          value={element.id}
                        >
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-2 mx-2 mb-2">
                  <Editor
                    editorText={description}
                    setEditorText={handleChangeDescription}
                    readOnly={false}
                    fileSelect={{
                      state: false,
                      fileData: [],
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end mr-2">
                <Form.Item label=" " className=" ">
                  <div className="flex ">
                    <Button
                      size="large"
                      htmlType="button"
                      type="primary"
                      onClick={cancelConfirmModle}
                      disabled={disableBtn}
                      className="button_cancel mx-3"
                    >
                      キャンセル
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      htmlType="submit"
                      disabled={disableBtn}
                      loading={disableBtn}
                    >
                      保存
                    </Button>
                  </div>
                </Form.Item>
              </div>
            </Form>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
EditTask.getInitialProps = async (ctx) => {
  const taskId = parseInt(ctx.query.id, 10)
  const userId = ctx.store.getState().get('auth').get('user').get('id')
  if (userId) {
    try {
      await axios.get(`${ctx.serverURL}/is-admin-task`, {
        params: { userId, taskId },
      })
    } catch (err) {
      ctx.res?.writeHead(302, { Location: '/top-page?error=403' })
      ctx.res?.end()
    }
  }
  return {}
}
EditTask.middleware = ['auth:member']
export default EditTask
