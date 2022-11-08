import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Form,
  Input,
  Select,
  Divider,
  Row,
  Col,
  Modal,
} from 'antd'
import { ScheduleOutlined, FlagOutlined } from '@ant-design/icons'
import _ from 'lodash'
import List from '../../../components/jf-schedule-edit-list'
import Layout from '../../../layouts/OtherLayout'
import './styles.scss'
import {
  getMilestonesList,
  getTemplateTaskList,
  postCheckExistName,
} from '../../../api/jf-schedule'
import TemplateTaskAdvance from '../../../components/template-task-advance/[id]'

const PHP_INT_MAX = 9223372036854776000
function addJobfairSchedule() {
  const [form] = Form.useForm()
  const router = useRouter()
  const [milestonesList, setMilestonesList] = useState([])
  const [templateTaskList, setTemplateTaskList] = useState([])
  const [addedMilestonesList, setAddedMilestonesList] = useState([])
  const [addedTemplateTaskList, setAddedTemplateTaskList] = useState([])
  const [nameInput, setNameInput] = useState('')
  const [visible, setVisible] = useState(false)
  const [isAdvSettingTab, setIsAdvSettingTab] = useState(false)
  const [dataAdvSetting, setDataAdvSetting] = useState([])
  const [dataSendSchedule, setDataSendSchedule] = useState({})

  useEffect(async () => {
    await getMilestonesList()
      .then(({ data }) => {
        setMilestonesList(data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
    await getTemplateTaskList()
      .then(({ data }) => {
        setTemplateTaskList(data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }, [])

  const milestonesOptions = []
  milestonesList.forEach((item) => {
    const value = item.id
    milestonesOptions.push({
      label: item.name,
      value,
    })
  })

  const onFinish = async () => {
    const dataSend = {
      name: nameInput,
      addedMilestones: addedMilestonesList,
      addedTemplateTasks: addedTemplateTaskList,
    }
    await postCheckExistName(dataSend)
      .then(async ({ data }) => {
        if (data !== 'exist') {
          let tmpMilestone = milestonesList.filter((mil) => addedMilestonesList.includes(mil.id))
          tmpMilestone = tmpMilestone.map((mil) => ({
            ...mil,
            day: mil.is_week ? mil.period * 7 : mil.period,
          }))
          tmpMilestone.sort((a, b) => a.day - b.day)
          tmpMilestone = tmpMilestone.map((mil, index) => {
            let tmpTT = templateTaskList.filter((temp) => addedTemplateTaskList.includes(temp.id) && mil.id === temp.milestone_id)
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
          setDataAdvSetting(tmpMilestone)
          setDataSendSchedule(dataSend)
          // await postData(dataSend)
          //   .then((res) => {
          //     if (res.status === 200) {
          //       router.push(`/template-task-advance/${res.data.id}`)
          //       openNotification('success', '正常に登録されました。')
          //     }
          //   }).catch((error) => {
          //     if (error.response.status === 404) {
          //       router.push('/404')
          //     }
          //   })
          setIsAdvSettingTab(true)
        }
      }).catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const onFinishFailed = () => {
    // const { errorFields } = errorInfo
    // errorFields.forEach((itemError) => {
    //   itemError.errors.forEach((error) => openNotification('error', error))
    // })
  }

  const onDeleteTemplateTask = (id) => {
    const newState = _.filter(addedTemplateTaskList, (item) => item !== id)
    setAddedTemplateTaskList(newState)
  }

  const onDeleteMilestone = (id) => {
    const newState = _.filter(addedMilestonesList, (item) => item !== id)
    setAddedMilestonesList(newState)
    form.setFieldsValue({
      milestone_select: newState,
    })
  }

  const onDeleteAllTemplateTask = (arr) => {
    const newState = addedTemplateTaskList.filter(
      (item) => !arr.includes(item),
    )
    setAddedTemplateTaskList(newState)
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

  const checkIsNameExisted = async () => {
    const dataSend = {
      name: nameInput,
    }
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
      }).catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const dataList = milestonesList.filter((milestone) => addedMilestonesList.includes(milestone.id))

  const handleOk = () => {
    setVisible(false)
    router.push('/schedules')
  }
  if (isAdvSettingTab) {
    return (
      // <Layout>
      //   <Layout.Main>
      <TemplateTaskAdvance
        dataAdvSetting={dataAdvSetting}
        setIsAdvSettingTab={setIsAdvSettingTab}
        dataSendSchedule={dataSendSchedule}
        editing={false}
      />
      //   </Layout.Main>
      // </Layout>
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

  const checkIsFormEmpty = () => {
    const inputsObject = form.getFieldValue()
    const inputs = Object.values(inputsObject)
    return inputs.every((input) => {
      if (input) {
        return false
      }
      return true
    })
  }

  const handleCancel = () => {
    if (checkIsFormEmpty()) {
      router.push('/jobfairs')
    } else {
      setVisible(true)
    }
  }

  return (
    <Layout>
      <Layout.Main>
        <div className="add-jf-schedule">
          <h1>JFスケジュール登録</h1>
          <Form
            labelAlign="left"
            labelCol={{ span: 7 }}
            size="large"
            form={form}
            name="edit-jfschedule"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            // requiredMark="optional"
          >
            <div className="w-1/2">
              <Form.Item
                label={(
                  <div className="flex items-center justify-between">
                    <ScheduleOutlined style={{ fontSize: '32px' }} />
                    <span className="ml-2 font-bold">JFスケジュール名</span>
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
                  onBlur={checkIsNameExisted}
                />
              </Form.Item>
              <Form.Item
                label={(
                  <div className="flex items-center w-full">
                    <FlagOutlined style={{ fontSize: '32px' }} />
                    <span className="ml-2 font-bold">マイルストーン</span>
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
                <Select {...selectMilestoneProps} />
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
                <>
                  <Button
                    size="large"
                    onClick={handleCancel}
                    className="w-32"
                  >
                    キャンセル
                  </Button>
                  <Modal
                    centered
                    visible={visible}
                    title="JFスケジュール登録"
                    onOk={handleOk}
                    onCancel={() => { setVisible(false) }}
                    footer={[
                      <Button
                        size="large"
                        key="back"
                        onClick={() => { setVisible(false) }}
                      >
                        いいえ
                      </Button>,
                      <Button
                        size="large"
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                      >
                        はい
                      </Button>,
                    ]}
                  >
                    <p>変更内容が保存されません。よろしいですか？</p>
                  </Modal>
                </>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="ml-3"
                  onClick={checkIsNameExisted}
                >
                  次へ
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Layout.Main>
    </Layout>
  )
}

addJobfairSchedule.middleware = ['auth:superadmin']
export default addJobfairSchedule
