/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import 'antd/dist/antd.css'
import React, { useState } from 'react'
import { Modal, Button, notification, Form, Input, Select } from 'antd'
import { useRouter } from 'next/router'
import { addMilestone, getNameExitAdd, checkMilestoneNameExisted } from '../../../api/milestone'
import Loading from '../../loading'

const AddMilestone = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [typePeriodInput, setTypePeriodInput] = useState(0)
  const [nameInput, setNameInput] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [form] = Form.useForm()
  const role = props.role
  const [loading, setLoading] = useState(false)
  const { Option } = Select
  const router = useRouter()

  function toHalfWidth(fullWidthStr) {
    return fullWidthStr.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const setReloadPage = () => {
    props.reloadPage()
    setIsModalVisible(false)
  }

  const openNotificationSuccess = () => {
    notification.success({
      message: '正常に保存されました。',
      duration: 3,
    })
    setReloadPage()
  }

  const handleOk = async () => {
    if (nameInput !== '' && timeInput !== '') {
      await getNameExitAdd(nameInput, timeInput, typePeriodInput).then((res) => {
        if (res.data.name.length !== 0) {
          form.setFields([
            {
              name: 'name',
              errors: ['このマイルストーン名は存在しています。'],
            },
          ])
        } else if (res.data.message === 'invalid period') {
          form.setFields([
            {
              name: 'time',
              errors: ['マイルストーンの開始日は重複しました。'],
            },
          ])
        } else {
          setLoading(true)
          addMilestone({
            name: nameInput,
            period: timeInput,
            is_week: typePeriodInput,
          })
            .then(() => openNotificationSuccess())
            .catch((error) => {
              if (nameInput.length > 100) {
                form.setFields([
                  {
                    name: 'name',
                    errors: ['入力されたマイルストーン名は少し長いです。'],
                  },
                ])
              } if ((parseInt(timeInput, 10) > 3000 && typePeriodInput === 0) || (parseInt(timeInput, 10) >= 429 && typePeriodInput === 1)) {
                form.setFields([
                  {
                    name: 'time',
                    errors: ['入力した期日は大きいです。'],
                  },
                ])
              }
            })
          setLoading(false)
        }
      })
    } else {
      if (nameInput === '') {
        form.setFields([
          {
            name: 'name',
            errors: ['この項目は必須です。'],
          },
        ])
      }
      if (timeInput === '') {
        form.setFields([
          {
            name: 'time',
            errors: ['この項目は必須です。'],
          },
        ])
      }
    }
  }

  const handleCancel = () => {
    form.setFieldsValue({
      name: '',
      time: '',
    })
    setIsModalVisible(false)
  }

  const checkErrorUnique = async (name) => {
    try {
      if (name && name.trim().length !== 0) {
        const response = await checkMilestoneNameExisted({
          name: name.trim(),
        })
        if (response?.data?.name) {
          form.setFields([
            {
              name: 'name',
              errors: ['このマイルストーン名は存在しています。'],
            },
          ])
        }
      }
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }

  const onBlur = (e) => {
    checkErrorUnique(e.target.value)
  }

  const onValueNameChange = (e) => {
    setNameInput(e.target.value)
    form.setFieldsValue({
      name: toHalfWidth(e.target.value),
    })
  }

  const onValueTimeChange = (e) => {
    setTimeInput(Number(toHalfWidth(e.target.value)))
    form.setFieldsValue({
      time: toHalfWidth(e.target.value),
    })
    const specialCharRegex = new RegExp(/^([^0-9]*)$/)
    if (specialCharRegex.test(e.target.value)) {
      form.setFields([
        {
          name: 'time',
          errors: ['０以上の半角の整数で入力してください。'],
        },
      ])
    }
  }

  const selectAfter = (
    <Form.Item name="typePeriod" noStyle>
      <Select
        className="select-after"
        onChange={(value) => {
          setTypePeriodInput(parseInt(value, 10))
        }}
        value={typePeriodInput.toString()}
        style={{
          width: 90,
        }}
      >
        <Option value="0">日後</Option>
        <Option value="1">週間後</Option>
      </Select>
    </Form.Item>
  )

  const blockInvalidChar = (e) => ['e', 'E', '+'].includes(e.key) && e.preventDefault()

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        size="large"
        className="ant-btn ml-3"
        style={{ letterSpacing: '-0.1em' }}
      >
        <span>追加</span>
      </Button>
      <Modal
        title="マイルストーン追加"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="登録"
        cancelText="キャンセル"
        okButtonProps={{ style: { letterSpacing: '-0.1em' } }}
        centered
      >
        <Loading loading={loading} overlay={loading} />
        <Form
          form={form}
          colon={false}
          name="addMilestone"
          initialValues={{
            typePeriod: '0',
          }}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
          size="large"
        >
          <Form.Item
            label={<span className="font-bold mr-3">マイルストーン名</span>}
            name="name"
            rules={[
              {
                required: true,
                message: 'この項目は必須です。',
              },
              () => ({
                validator(_, value) {
                  const specialCharRegex = new RegExp('[ 　]')
                  if (specialCharRegex.test(value)) {
                    return Promise.reject(
                      new Error(
                        'マイルストーン名はスペースが含まれていません。',
                      ),
                    )
                  }

                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              className="w-full"
              onBlur={onBlur}
              onChange={onValueNameChange}
              placeholder="マイルストーン名"
            />
          </Form.Item>
          <Form.Item
            label={<span className="font-bold mr-3">期日</span>}
            name="time"
            rules={[
              {
                required: true,
                message: 'この項目は必須です。',
              },

              {
                pattern: /^(?:\d*)$/,
                message: '０以上の半角の整数で入力してください。',
              },
            ]}
          >
            <Input
              // type="number"
              type="text"
              placeholder="期日"
              addonAfter={selectAfter}
              onKeyDown={blockInvalidChar}
              onChange={onValueTimeChange}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddMilestone
