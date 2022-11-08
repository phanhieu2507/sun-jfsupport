import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Form,
  Input,
  notification,
  Select,
  Divider,
  Row,
  Col,
} from 'antd'
import { ScheduleOutlined, FlagOutlined } from '@ant-design/icons'
import _ from 'lodash'
import List from '../../../../components/jf-schedule-edit-list'
import Layout from '../../../../layouts/OtherLayout'
import JfScheduleCancelButton from '../../../../components/jf-schedule-cancel-button'
import './styles.scss'
import {
  getMilestonesList,
  getSchedule,
  getTemplateTaskList,
  getAddedMilestonesList,
  getAddedTemplateTaskList,
  postCheckExistName,
} from '../../../../api/jf-schedule'
import TemplateTaskAdvance from '../../../../components/template-task-advance/[id]'
import { getNewMilestone } from '../../../../api/template-advance'

const PHP_INT_MAX = 9223372036854776000
function editJobfairSchedule() {
  const [form] = Form.useForm()
  const router = useRouter()
  const [beforeEditName, setbeforeEditName] = useState('')
  const [beforeEditMilestone, setBeforeEditMilestone] = useState([])
  const [beforeEditTemplateTaskList, setBeforeEditTemplateTaskList] = useState([])
  const [milestonesList, setMilestonesList] = useState([])
  const [templateTaskList, setTemplateTaskList] = useState([])
  const [addedMilestonesList, setAddedMilestonesList] = useState([])
  const [addedTemplateTaskList, setAddedTemplateTaskList] = useState([])
  const [nameInput, setNameInput] = useState('')
  // const [isModalVisible, setIsModalVisible] = useState(false)
  const [isAdvSettingTab, setIsAdvSettingTab] = useState(false)
  const [originalDataAdvSetting, setOriginalDataAdvSetting] = useState([])
  const [dataAdvSetting, setDataAdvSetting] = useState([])
  const [dataSendSchedule, setDataSendSchedule] = useState({})

  useEffect(async () => {
    const temp = /[/](\d+)[/]/.exec(window.location.pathname)
    const id = `${temp[1]}`

    await getSchedule(id)
      .then(({ data }) => {
        setbeforeEditName(data.name)
        setNameInput(data.name)
        form.setFieldsValue({
          jfschedule_name: data.name,
        })
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          router.push('/404')
        }
      })
    await getMilestonesList()
      .then(({ data }) => {
        setMilestonesList(data)
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          router.push('/404')
        }
      })
    await getTemplateTaskList()
      .then(({ data }) => {
        setTemplateTaskList(data)
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          router.push('/404')
        }
      })
    await getAddedMilestonesList(id)
      .then(({ data }) => {
        const arr = []
        data.forEach((item) => {
          arr.push(item.id)
        })
        setAddedMilestonesList(arr)
        setBeforeEditMilestone(arr)
        form.setFieldsValue({
          milestone_select: arr,
        })
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          router.push('/404')
        }
      })
    await getAddedTemplateTaskList(id)
      .then(({ data }) => {
        const arr = []
        data.forEach((item) => {
          arr.push(item.id)
        })
        setAddedTemplateTaskList(arr)
        setBeforeEditTemplateTaskList(arr)
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          router.push('/404')
        }
      })
    await getNewMilestone(id).then(({ data }) => {
      const tmpOriginalDataAdvSetting = Object.values(data)
      setOriginalDataAdvSetting(tmpOriginalDataAdvSetting)
    }).catch((error) => {
      if (error.response?.status === 404) {
        router.push('/404')
      }
    })
  }, [])

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 3,
    })
  }

  const milestonesOptions = []
  milestonesList.forEach((item) => {
    const value = item.id
    milestonesOptions.push({
      label: item.name,
      value,
    })
  })

  const handlerNextTab = (dataSend) => {
    let tmpMilestone = milestonesList.filter((mil) => addedMilestonesList.includes(mil.id))
    tmpMilestone = tmpMilestone.map((mil) => ({
      ...mil,
      day: mil.is_week ? mil.period * 7 : mil.period,
    }))
    tmpMilestone.sort((a, b) => a.day - b.day)
    tmpMilestone = tmpMilestone.map((mil, index) => {
      let tmpTT = templateTaskList.filter(
        (temp) => addedTemplateTaskList.includes(temp.id) && mil.id === temp.milestone_id,
      )
      tmpTT = tmpTT.map((tt) => ({
        ...tt,
        duration: [0, 1],
        is_parent: 0,
        parent: 0,
      }))
      return {
        ...mil,
        gap: index === tmpMilestone.length - 1 ? PHP_INT_MAX : tmpMilestone[index + 1].day - tmpMilestone[index].day,
        template_tasks: tmpTT,
      }
    })
    const newSchedule = tmpMilestone.map((item) => {
      const templateTask = item.template_tasks.filter((i) => !i.is_parent).map((i) => i.id)
      return { [item.id]: templateTask }
    })
    const originalSchedule = originalDataAdvSetting.map((item) => {
      const templateTask = item.template_tasks.filter((i) => !i.is_parent).map((i) => i.id)
      return { [item.id]: templateTask }
    })
    if (JSON.stringify(newSchedule) === JSON.stringify(originalSchedule)) {
      setDataAdvSetting(originalDataAdvSetting)
    } else {
      setDataAdvSetting(tmpMilestone)
    }
    setDataSendSchedule(dataSend)
    setIsAdvSettingTab(true)
  }

  const onFinish = async () => {
    const dataSend = {
      name: nameInput,
      addedMilestones: addedMilestonesList,
      addedTemplateTasks: addedTemplateTaskList,
    }
    if (nameInput !== beforeEditName) {
      await postCheckExistName(dataSend).then(({ data }) => {
        if (data === 'exist'
        //   && !(
        //     form.isFieldTouched('jfschedule_name')
        //     && form.isFieldTouched('milestone_select')
        //   ))
        // || !!form.getFieldsError().filter(({ errors }) => errors.length)
        //   .length
        // || isError === true
        ) {
          // e.prevenDefault()
          openNotification('error', 'このJFスケジュール名は存在しています。')
        } else {
          // putData(id, dataSend).then((res) => {
          //   if (res.status === 200) {
          //     router.push('/schedule')
          //     openNotification('success', '変更は正常に保存されました。')
          //   }
          // })
          //   .catch((error) => {
          //     if (error.response.status === 404) {
          //       router.push('/404')
          //     }
          //     if (error.response.data.errors.addedMilestones) {
          //       openNotification('error', error.response.data.errors.addedMilestones[0])
          //     } else if (error.response.data.errors.addedTemplateTasks) {
          //       openNotification('error', error.response.data.errors.addedTemplateTasks[0])
          //     }
          //   })
          handlerNextTab(dataSend)
        }
      })
        .catch((error) => {
          if (error.response?.status === 404) {
            router.push('/404')
          }
        })
    } else {
      // putData(id, dataSend).then((res) => {
      //   if (res.status === 200) {
      //     // setIsModalVisible(false)
      //     router.push('/schedule/')
      //     openNotification('success', '変更は正常に保存されました。')
      //   }
      // })
      //   .catch((error) => {
      //     if (error.response.status === 404) {
      //       router.push('/404')
      //     }
      //     if (error.response.data.errors.addedMilestones) {
      //       openNotification('error', error.response.data.errors.addedMilestones[0])
      //     } else if (error.response.data.errors.addedTemplateTasks) {
      //       openNotification('error', error.response.data.errors.addedTemplateTasks[0])
      //     }
      //   })
      handlerNextTab(dataSend)
    }
  }

  const onDeleteTemplateTask = (id) => {
    const newState = _.filter(addedTemplateTaskList, (item) => item !== id)
    setAddedTemplateTaskList(newState)
  }

  const onDeleteAllTemplateTask = (arr) => {
    const newState = addedTemplateTaskList.filter(
      (item) => !arr.includes(item),
    )
    setAddedTemplateTaskList(newState)
  }

  const onDeleteMilestone = (id) => {
    const newState = _.filter(addedMilestonesList, (item) => item !== id)
    setAddedMilestonesList(newState)
    form.setFieldsValue({
      milestone_select: newState,
    })
  }

  const onAddTemplateTask = (id) => {
    const newState = [...addedTemplateTaskList, id]
    setAddedTemplateTaskList(newState)
  }

  const selectMilestoneProps = {
    mode: 'multiple',
    optionFilterProp: 'label',
    value: addedMilestonesList,
    options: milestonesOptions,
    onChange: (newValue) => {
      setAddedMilestonesList(newValue)
    },
    placeholder: 'マイルストーンを入力してください。',
    maxTagCount: 'responsive',
    showArrow: true,
  }

  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
  }

  const onBlur = async () => {
    const dataSend = {
      name: nameInput,
    }
    if (nameInput !== beforeEditName) {
      await postCheckExistName(dataSend)
        .then(({ data }) => {
          if (data === 'exist') {
            form.setFields([
              {
                name: 'jfschedule_name',
                errors: ['このJFスケジュール名は存在しています。'],
              },
            ])
          }
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            router.push('/404')
          }
        })
    }
  }
  // const showModal = () => {
  //   if (
  //     !(form.isFieldTouched('jfschedule_name') && form.isFieldTouched('milestone_select'))
  //     || !!form.getFieldsError().filter(({ errors }) => errors.length).length
  //     || isError === true
  //   ) {
  //     setIsModalVisible(false)
  //   } else {
  //     setIsModalVisible(true)
  //   }
  // }
  // const handleCancel = () => {
  //   setIsModalVisible(false)
  // }
  const dataList = milestonesList.filter((milestone) => addedMilestonesList.includes(milestone.id))

  if (isAdvSettingTab) {
    return (
      <TemplateTaskAdvance
        dataAdvSetting={dataAdvSetting}
        setIsAdvSettingTab={setIsAdvSettingTab}
        dataSendSchedule={dataSendSchedule}
        editing
      />
    )
  }
  const jfScheduleNameValidator = ($, value) => {
    if (!value) {
      return Promise.reject(new Error('JFスケジュール名を入力してください。'))
    }
    if (value.trim().length === 0) {
      return Promise.reject(new Error('1文字以上の文字を入力してください。'))
    }

    return Promise.resolve()
  }
  return (
    <Layout>
      <Layout.Main>
        <div className="edit-jf-schedule">
          <h1>JFスケジュール編集</h1>
          <Form
            labelAlign="left"
            labelCol={{ span: 7 }}
            size="large"
            form={form}
            name="edit-jfschedule"
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            // requiredMark="optional"
          >
            <div className="w-1/2">
              <Form.Item
                label={(
                  <div className="flex items-center justify-between">
                    <ScheduleOutlined style={{ fontSize: '32px' }} />
                    <span className="ml-2">JFスケジュール名</span>
                  </div>
                )}
                name="jfschedule_name"
                required
                rules={[
                  {
                    validator: jfScheduleNameValidator,
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="JFスケジュール名を入力してください。"
                  onChange={onValueNameChange}
                  onBlur={onBlur}
                />
              </Form.Item>
              <Form.Item
                label={(
                  <div className="flex items-center w-full">
                    <FlagOutlined style={{ fontSize: '32px' }} />
                    <span className="ml-2">マイルストーン</span>
                  </div>
                )}
                name="milestone_select"
                rules={[
                  {
                    required: true,
                    message: 'マイルストーンを入力してください。',
                  },
                ]}
              >
                <Select size="large" {...selectMilestoneProps} />
              </Form.Item>
            </div>
            <Divider />
            <Row gutter={[24, 24]}>
              {dataList.map((milestone) => {
                const templateTaskChildernList = _.filter(templateTaskList, {
                  milestone_id: milestone.id,
                })
                const templateTaskOptions = []
                templateTaskChildernList.forEach((item) => {
                  const value = item.id
                  templateTaskOptions.push({
                    label: item.name,
                    value,
                  })
                })
                const addedTemplateTaskChildernList = []
                templateTaskChildernList.forEach((item) => {
                  if (_.includes(addedTemplateTaskList, item.id)) {
                    addedTemplateTaskChildernList.push(item.id)
                  }
                })
                return (
                  <Col span={12} key={milestone.id}>
                    <List
                      milestone={milestone}
                      templateTaskChildernList={templateTaskChildernList}
                      addedTemplateTaskChildernList={addedTemplateTaskChildernList}
                      templateTaskOptions={templateTaskOptions}
                      onDeleteTemplateTask={onDeleteTemplateTask}
                      onDeleteAllTemplateTask={onDeleteAllTemplateTask}
                      onDeleteMilestone={onDeleteMilestone}
                      onAddTemplateTask={onAddTemplateTask}
                      selectName={`template_task_select_${milestone.id}`}
                      form={form}
                    />
                  </Col>
                )
              })}
            </Row>

            <Form.Item>
              <div className="mt-5 flex justify-end">
                <JfScheduleCancelButton
                  beforeEditData={{
                    name: beforeEditName,
                    milestone: beforeEditMilestone,
                    templateTask: beforeEditTemplateTaskList,
                  }}
                  editedData={{
                    name: nameInput,
                    milestone: addedMilestonesList,
                    templateTask: addedTemplateTaskList,
                  }}
                />
                <Button
                  size="large"
                  type="primary"
                  style={{ letterSpacing: '-2px' }}
                  htmlType="submit"
                  className="ml-3"
                >
                  次へ
                </Button>
              </div>
            </Form.Item>
            {/* <Modal
              title="JFスケジュール編集"
              visible={isModalVisible}
              onOk={onFinish}
              onCancel={handleCancel}
              okText="はい"
              cancelText="いいえ"
            >
              <p className="mb-5">保存してもよろしいですか</p>
            </Modal> */}
          </Form>
        </div>
      </Layout.Main>
    </Layout>
  )
}

editJobfairSchedule.middleware = ['auth:superadmin']
export default editJobfairSchedule
