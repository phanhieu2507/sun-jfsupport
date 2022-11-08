import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  List,
  Modal,
  notification,
  Select,
  Space,
} from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import addJFAPI from '~/api/add-jobfair'
import OtherLayout from '../../../layouts/OtherLayout'
import * as Extensions from '../../../utils/extensions'
import Loading from '../../../components/loading'
import './style.scss'

const { Option } = Select

const index = () => {
  const allChannelType = [
    { id: 0, name: '新しいチャンネル' },
    { id: 1, name: '既存チャンネル' },
  ]
  const errorMessages = {
    name_taken: 'このSlackチャンネル名はすでに存在します。 チャンネル名を変更してください。',
    channel_not_found: 'このチャンネルには、JF Support BOT というアプリを追加してください。',
    channel_exists: 'このチャンネルは別のJFで利用されています。',
    user_not_found: '担当者のSlackIDは有効ではありません。',
    invalid_name_specials: 'チャンネル名は正しくありません。',
  }

  // page state.
  const [listAdminJF, setlistAdminJF] = useState([])
  const [listSchedule, setlistSchedule] = useState([])
  const [listMilestone, setlistMilestone] = useState([])
  const [listTask, setlistTask] = useState([])
  const [listCompany, setListCompany] = useState([])
  // const [disableBtn, setdisableBtn] = useState(false)
  const [isFormChange, setIsFormChange] = useState(false)
  const [loading, setLoading] = useState(true)

  const [channelType, setChannelType] = useState(0)

  const [form] = Form.useForm()
  const router = useRouter()
  // route function handle all route in this page.
  const routeTo = async (url) => {
    router.prefetch(url)
    router.push(url)
  }

  // check if all input is empty.
  const checkIsFormInputEmpty = () => {
    // get all input values .
    const inputValues = form.getFieldsValue()
    //  return type :[]
    const inputs = Object.values(inputValues)

    for (let i = 0; i < inputs.length; i += 1) {
      const element = inputs[i]
      if (element) {
        return false
      }
    }
    return true
  }

  const onChangeForm = () => {
    setIsFormChange(true)
  }

  useEffect(() => {
    // Extensions.unSaveChangeConfirm(true)

    const fetchAPI = async () => {
      try {
        // TODO: optimize this one by using axios.{all,spread}
        const admins = await addJFAPI.getAdmin()
        const schedules = await addJFAPI.getSchedule()
        const companies = await addJFAPI.getCompany()
        setlistAdminJF(Array.from(admins.data))
        setlistSchedule(Array.from(schedules.data))
        setListCompany(Array.from(companies.data))
        return null
      } catch (error) {
        if (error.response.status === 404) {
          routeTo('/404')
        } else return Error(error.toString())
        return null
      }
    }
    fetchAPI()
    setLoading(false)
  }, [])

  /* utilities function for support handle form */
  // reset form.
  const onFormReset = () => {
    form.resetFields()
    setlistMilestone([])
    setlistTask([])
  }

  const autoConvertHalfwidth = (event) => {
    // get id (name) of the input that invoke this function
    const inputRef = event.target.id
    const dummyObject = {}
    dummyObject[inputRef] = Extensions.toHalfWidth(event.target.value)
    if (inputRef) {
      form.setFieldsValue(dummyObject)
    }
  }

  /* Handle 2 form event when user click  キャンセル button or  登録 button */
  const onFinishFailed = (errorInfo) => errorInfo

  /* handle modal or popup to notifiy to user */

  //  open prompt after cancel button clicked .
  const cancelConfirmModle = () => {
    if (checkIsFormInputEmpty() && !isFormChange) {
      routeTo('/jobfairs')
    } else {
      Modal.confirm({
        title: '入力内容が保存されません。よろしいですか？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk: () => {
          onFormReset()
          routeTo('/jobfairs')
        },
        onCancel: () => {},
        centered: true,
        okText: 'はい',
        okButtonProps: { size: 'large' },
        cancelText: 'いいえ',
        cancelButtonProps: { size: 'large' },
      })
    }
  }
  //  open success notification after add jobfair button clicked .
  const saveNotification = () => {
    notification.success({
      duration: 3,
      message: '正常に登録されました。',
      onClick: () => {},
    })
  }

  // handle user click add job fair.
  const onFinishSuccess = async (values) => {
    setLoading(true)
    try {
      Extensions.unSaveChangeConfirm(false)
      const data = {
        name: values.name.toString(),
        schedule_id: values.schedule_id * 1.0,
        start_date: values.start_date.format(Extensions.dateFormat),
        number_of_students: values.number_of_students * 1.0,
        number_of_companies: values.number_of_companies * 1.0,
        jobfair_admin_id: 2, // To avoid errors, the default value is 2
        channel: values.channel.toString(),
        channel_type: values.channel_type * 1.0,
        admin_ids: values.admin_ids,
        // TODO: Add companies data when upload API allows
      }
      // setdisableBtn(true)

      const response = await addJFAPI.addJF(data)
      if (response.status < 299) {
        setLoading(false)
        routeTo(`/jobfairs/${response.data.id}/jf-toppage`)
        saveNotification()
      }
      // else {
      //   setdisableBtn(false)
      // }
      return response
    } catch (error) {
      setLoading(false)
      // setdisableBtn(false)
      // const errorResponse = JSON.parse(error.request.response)
      // if (errorResponse.message.toLocaleLowerCase().includes('duplicate')) {
      //   notification.error({
      //     duration: 3,
      //     message: errorResponse.errors.name[0],
      //     onClick: () => {},
      //   })
      // } else {
      //   notification.error({
      //     duration: 3,
      //     message: errorResponse.errors.name[0],
      //     onClick: () => {}eEb,
      //   })
      // }
      if (error.response.status === 404) {
        routeTo('/404')
      }
      if (error.response.status === 422) {
        notification.error({
          duration: 3,
          message: (errorMessages[error.response.data.error] || 'JFを登録できません。'),
          onClick: () => {},
        })
      }
      return error
    }
  }
  /* handle jobfair schedule selector change .  */
  // call api get milestone  when selector change schedule.
  const getMilestone = async (id) => {
    try {
      const milestones = await addJFAPI.getMilestone(id)
      if (milestones.data.milestones) {
        setlistMilestone(Array.from(milestones.data.milestones))
      }
    } catch (error) {
      if (error.response.status === 404) {
        routeTo('/404')
      }
    }
  }

  // call api get milestone  when selector change schedule
  const getTask = async (id) => {
    try {
      const tasks = await addJFAPI.getTaskList(id)
      if (tasks.data.template_tasks) {
        setlistTask(Array.from(tasks.data.template_tasks))
      }
    } catch (error) {
      if (error.response.status === 404) {
        routeTo('/404')
      }
    }
  }

  // handle when ever selector change.
  // FIXME: error: event is undefined
  const onScheduleSelect = (_, event) => {
    const scheduleId = event.key

    getMilestone(scheduleId)
    getTask(scheduleId)
  }
  const checkIsJFNameExisted = async () => {
    try {
      const name = form.getFieldValue('name')
      if (name) {
        const response = await addJFAPI.isJFExisted({ name })

        if (response.data.length) {
          document.getElementById('validate_name').style.border = '1px solid red'
          return document.getElementById('error-msg').removeAttribute('hidden')
        }
      }
      return false
    } catch (error) {
      if (error.response.status === 404) {
        routeTo('/404')
      }
      return error
    }
  }

  /* Validator of all input. */
  const JFNameValidator = (_, value) => {
    if (!value) {
      // handleInputEmpty(name)
      return Promise.reject(new Error('この項目は必須です'))
    }
    if (value.match(Extensions.Reg.specialCharacter)) {
      return Promise.reject(new Error('使用できない文字が含まれています'))
    }
    if (value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('数字のみを含めることはできない'))
    }
    if (value.trim().length === 0) {
      return Promise.reject(new Error('1文字以上の文字を入力してください。'))
    }

    return Promise.resolve()
  }

  const channelNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    if (value.trim().length === 0) {
      return Promise.reject(new Error('1文字以上の文字を入力してください。'))
    }

    return Promise.resolve()
  }
  const startDayValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    return Promise.resolve()
  }
  const companiesJoinValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    if (value <= 0) {
      return Promise.reject(new Error('1以上の半角の整数で入力してください'))
    }
    // check case when user set number of company that join JF smaller than 1
    if (Extensions.isFullWidth(value)) {
      // return Promise.reject(new Error('1以上の半角の整数で入力してください'))
    }
    if (!value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('使用できない文字が含まれています。'))
    }

    const numberOfCompanies = form.getFieldValue('companies').length

    if (!Number.isNaN(numberOfCompanies) && numberOfCompanies !== parseInt(value, 10)) {
      return Promise.reject(new Error('選択した企業数と「参加企業社数」に入力した参加企業数が一致'))
    }

    return Promise.resolve()
  }
  const studentsJoinValidator = (_, value) => {
    if (!value) {
      // handleInputEmpty(name)
      return Promise.reject(new Error('この項目は必須です'))
    }
    if (value <= 0) {
      return Promise.reject(new Error('1以上の半角の整数で入力してください'))
    }
    if (!value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('使用できない文字が含まれています。'))
    }

    if (Extensions.isFullWidth(value)) {
      return Promise.reject(new Error('1以上の半角の整数で入力してください'))
    }

    return Promise.resolve()
  }
  const JFAdminValidator = (_, value) => {
    if (!value || (value && value.length === 0)) {
      // handleInputEmpty(name)
      return Promise.reject(new Error('この項目は必須です'))
    }

    return Promise.resolve()
  }
  const JFScheduleValidator = (_, value) => {
    if (!value) {
      // handleInputEmpty(name)
      return Promise.reject(new Error('この項目は必須です'))
    }
    return Promise.resolve()
  }
  const companyValidator = async (_, value) => {
    if (value.length === 0) {
      return Promise.reject(new Error('この項目は必須です'))
    }

    const numberOfCompanies = form.getFieldValue('number_of_companies')

    if (!Number.isNaN(numberOfCompanies) && value.length !== parseInt(numberOfCompanies, 10)) {
      return Promise.reject(new Error('選択した企業数と「参加企業社数」に入力した参加企業数が一致'))
    }

    return Promise.resolve()
  }
  /* Validator of all input end */

  const handleChangeChannelType = (value) => {
    setChannelType(value)
  }

  return (
    <div className="add-jf-schedule">
      <Loading loading={loading} overlay={loading} />
      <OtherLayout>
        <OtherLayout.Main>
          <h1>JF追加 </h1>
          <div className="addJF-page">
            {/* JF名 戻る JF-スケジュール 管理者 開始日 参加企業社数  推定参加学生数 タスク一賜 マイルストーン一覧 */}
            <div className="container mx-auto flex-1 justify-center px-4  pb-20">
              <div>
                <div className="container ">
                  <Form
                    form={form}
                    labelCol={{
                      span: 6,
                    }}
                    wrapperCol={{
                      span: 14,
                    }}
                    className="mx-20"
                    layout="horizontal"
                    colon={false}
                    initialValues={{ defaultInputValue: 0, channel_type: 0 }}
                    onFinish={onFinishSuccess}
                    onFinishFailed={onFinishFailed}
                    onValuesChange={onChangeForm}
                    labelAlign="right"
                  >
                    <div className="flex justify-center">
                      <div className="left-side w-1/2">
                        {/* jobfair name */}
                        <Form.Item
                          label={<p className="font-bold text-right">JF名</p>}
                          required
                        >
                          <Form.Item
                            name="name"
                            noStyle
                            rules={[
                              {
                                validator: JFNameValidator,
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              type="text"
                              id="validate_name"
                              onBlur={checkIsJFNameExisted}
                              onChange={() => {
                                document
                                  .getElementById('error-msg')
                                  .setAttribute('hidden', 'true')
                                document.getElementById(
                                  'validate_name',
                                ).style.border = '1px solid #e5e7eb'
                              }}
                              placeholder="JF名を入力する"
                              maxLength={200}
                            />

                          </Form.Item>
                          <span
                            id="error-msg"
                            style={{ color: '#ff3860', fontSize: '14px' }}
                            className="text-red-600"
                            hidden
                          >
                            この名前はすでに存在します
                          </span>
                        </Form.Item>
                        {/* Slack chanel type */}

                        <Form.Item
                          required
                          // hasFeedback
                          label={<p className="font-bold">チャンネルタイプ</p>}
                          name="channel_type"
                        >
                          <Select
                            size="large"
                            onChange={handleChangeChannelType}
                          >
                            {
                              allChannelType.map((channel) => (
                                <Option
                                  key={channel.id}
                                  value={channel.id}
                                >
                                  {channel.name}
                                </Option>
                              ))
                            }
                          </Select>
                        </Form.Item>

                        {/* number of companies */}
                        <Form.Item
                          required
                          // hasFeedback
                          label={<p className="font-bold">参加企業社数</p>}
                          name="number_of_companies"
                          rules={[
                            {
                              validator: companiesJoinValidator,
                            },
                          ]}
                          dependencies={['companies']}
                        >
                          <Input
                            type="text"
                            size="large"
                            min={1}
                            onChange={(e) => {
                              autoConvertHalfwidth(e)
                            }}
                            placeholder="参加企業社数"
                          />
                        </Form.Item>
                        {/* jobfair admin */}
                        <Form.Item
                          required
                          // hasFeedback
                          label={<p className="font-bold">管理者</p>}
                          name="admin_ids"
                          rules={[
                            {
                              validator: JFAdminValidator,
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showArrow
                            mode="multiple"
                            allowClear
                            className="addJF-selector"
                            placeholder="管理者を選択"
                            optionFilterProp="children"
                            filterOption={
                              (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {listAdminJF.map((element) => (
                              <Select.Option
                                key={element.id}
                                value={element.id}
                              >
                                {element.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        {/* companies list */}
                        <Form.Item
                          required
                          // hasFeedback
                          label={<p className="font-bold">企業名</p>}
                          name="companies"
                          rules={[
                            {
                              validator: companyValidator,
                            },
                          ]}
                          dependencies={['number_of_companies']}
                        >
                          <Select
                            size="large"
                            className="addJF-selector"
                            placeholder="企業名"
                            mode="multiple"
                            maxTagCount="responsive"
                          >
                            {listCompany.map((element) => (
                              <Select.Option
                                key={element.id}
                                value={element.id}
                              >
                                {element.company_name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        {/* list milestones */}
                        <Form.Item label=" ">
                          <span className="label font-bold">
                            マイルストーン一覧
                          </span>
                          <List
                            className="demo-infinite-container"
                            bordered
                            locale={{
                              emptyText: (
                                <Empty
                                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                                  description="データがありません"
                                />
                              ),
                            }}
                            // style={{ backgroundColor: '#e3f6f5' }}
                            size="small"
                            dataSource={listMilestone}
                            renderItem={(item) => (
                              <List.Item className="list-items" key={item.id}>
                                {item.name}
                              </List.Item>
                            )}
                          />
                        </Form.Item>
                      </div>
                      <div className="right-side w-1/2">
                        {/* start date */}
                        <Form.Item
                          required
                          label={<p className="font-bold">開始日</p>}
                          name="start_date"
                          // hasFeedback
                          rules={[
                            {
                              validator: startDayValidator,
                            },
                          ]}
                        >
                          <DatePicker
                            size="large"
                            help="Please select the correct date"
                            className="py-2"
                            format={Extensions.dateFormat}
                            placeholder={Extensions.dateFormat}
                          />
                        </Form.Item>

                        {/* Slack chanel name */}
                        <Form.Item
                          required
                          // hasFeedback
                          label={<p className="font-bold">{channelType ? 'チャンネルID' : 'チャンネル名'}</p>}
                          name="channel"
                          rules={[
                            {
                              validator: channelNameValidator,
                            },
                          ]}
                        >
                          <Input
                            type="text"
                            size="large"
                            onChange={(e) => {
                              autoConvertHalfwidth(e)
                            }}
                            placeholder={`${channelType ? 'チャンネルID' : 'チャンネル名'}を入力する`}
                          />
                        </Form.Item>
                        {/* number of students */}
                        <Form.Item
                          required
                          // hasFeedback
                          label={<p className="font-bold">推定参加学生数</p>}
                          name="number_of_students"
                          rules={[
                            {
                              validator: studentsJoinValidator,
                            },
                          ]}
                        >
                          <Input
                            type="text"
                            size="large"
                            min={1}
                            onChange={(e) => {
                              autoConvertHalfwidth(e)
                            }}
                            placeholder="推定参加学生数"
                          />
                        </Form.Item>
                        {/* jobfair schedule */}
                        <Form.Item
                          required
                          label={(
                            <p className="font-bold text-right">
                              JFスケジュール
                            </p>
                          )}
                          name="schedule_id"
                          // label="JFスケジュール"
                          rules={[
                            {
                              validator: JFScheduleValidator,
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            className="addJF-selector"
                            placeholder="JF-スケジュールを選択"
                            onSelect={onScheduleSelect}
                          >
                            {listSchedule.map((element) => (
                              <Select.Option
                                key={element.id}
                                value={element.id}
                              >
                                {element.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        {/* The form field below is used to create blank space */}
                        <Form.Item
                          required
                          // hasFeedback
                          label={<p className="font-bold">Blank</p>}
                          name="blank"
                          style={{ visibility: 'hidden' }}
                        />
                        {/* list task */}
                        <Form.Item label=" ">
                          <span className="label font-bold">タスク一覧</span>
                          <List
                            className="demo-infinite-container"
                            bordered
                            // style={{ backgroundColor: '#e3f6f5' }}
                            size="small"
                            locale={{
                              emptyText: (
                                <Empty
                                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                                  description="データがありません"
                                />
                              ),
                            }}
                            dataSource={listTask}
                            renderItem={(item) => (
                              <List.Item className="list-items" key={item.id}>
                                {item.name}
                              </List.Item>
                            )}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    {/* 2 button */}
                    <div className="flex justify-end -mr-16">
                      <Form.Item label="">
                        <Space size={20}>
                          <Button
                            size="large"
                            htmlType="button"
                            className="ant-btn"
                            onClick={cancelConfirmModle}
                            // disabled={disableBtn}
                            // loading={loading}
                          >
                            キャンセル
                          </Button>
                          {/* --------------------------- */}
                          <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            // disabled={disableBtn}
                            // loading={loading}
                            style={{ letterSpacing: '-1px' }}
                          >
                            登録
                          </Button>
                        </Space>
                      </Form.Item>
                      {/* end form */}
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}

index.middleware = ['auth:superadmin']
export default index
