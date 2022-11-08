/* eslint-disable no-empty */
import { EditOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Tag, Tooltip } from 'antd'
import 'antd/dist/antd.css'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getUser, taskData } from '../../api/task-detail'
import { addComment } from '../../api/comment'
import BoxComment from './editor'
import './style.scss'

const index = ({ id }) => {
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(true)
  const [form] = Form.useForm()
  const [listUser, setListUser] = useState([])
  const [assign, setAssign] = useState(true)
  const [value, setValue] = useState('')
  const router = useRouter()

  // Modal
  const showBox = () => {
    setVisible(true)
    setShow(false)
  }

  const closeBox = () => {
    setVisible(false)
    setShow(true)
  }

  const fetchListMember = async () => {
    await getUser()
      .then((response) => {
        setListUser(response.data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        }
      })
  }

  const fetchTaskData = async () => {
    await taskData(id).then((response) => {
      form.setFieldsValue({
        // assignee: listmember,
        status: response.data.status,
      })
    }).catch((error) => {
      if (error.response.status === 404) {
        router.push('/404')
      }
    })
  }

  useEffect(() => {
    fetchListMember()
    fetchTaskData()
  }, [])

  const listStatus = ['未着手', '進行中', '完了', '中断', '未完了']

  const tagRender = (props) => {
    // eslint-disable-next-line react/prop-types
    const { label, closable, onClose } = props
    const nameUser = form.getFieldValue('assignee')
    if (nameUser.length !== 0) {
      setAssign(true)
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
          }
          if (nameUsers.length !== 0) {
            setAssign(true)
          }
        }}
        style={{ padding: '7px' }}
      >
        <Tooltip title={label}>
          <span className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden">
            {label}
          </span>
        </Tooltip>
      </Tag>
    )
  }

  const onFormSummit = async () => {
    const { status, assignee } = form.getFieldsValue()
    // TODO: change task description
    const newComment = {
      task_id: id,
      body: value,
      assignee: JSON.stringify(assignee),
      status,
      description: 'Task Description',
    }
    try {
      const response = await addComment(newComment)
      if (response.status === 200 || response.status === 201) {
      }
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }
  const typing = (e) => {
    setValue(e.target.value)
  }
  return (
    <div className="mt-5 box-comment">
      {show ? (
        <div className="flex">
          <Input
            style={{ width: '89%' }}
            onClick={showBox}
            placeholder="コメントを入力してください"
          />
          <div className="btn" onClick={showBox} style={{ cursor: 'pointer' }}>
            <EditOutlined className="ml-6" />
            <span>ステータス変更</span>
          </div>
        </div>
      ) : null}
      {visible ? (
        <div className="box">
          <Form form={form} layout="vertical" onFinish={onFormSummit}>
            <div className="pos flex items-center justify-between">
              <div className="pos-left">
                <Form.Item
                  label=""
                  className="block mx-7"
                  style={{ display: 'block' }}
                  name="detail"
                  onChange={typing}
                >
                  <BoxComment value={value} />
                </Form.Item>
              </div>
              <div className="pos-right">
                <Form.Item label={<p className="font-bold">ステータス</p>} name="status">
                  <Select size="large" className="addJF-selector" placeholder="ステータス">
                    {listStatus.map((element) => (
                      <Select.Option value={element}>{element}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={<p className="font-bold">担当者</p>}
                  name="assignee"
                  className="multiples"
                >
                  {assign ? (
                    <Select mode="multiple" showArrow tagRender={tagRender}>
                      {listUser.map((element) => (
                        <Select.Option
                          className="validate-user"
                          key={element.id}
                          value={element.id}
                        >
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%', border: '1px solid red', borderRadius: 6 }}
                      className="multiples"
                    >
                      {listUser.map((element) => (
                        <Select.Option
                          className="validate-user"
                          key={element.id}
                          value={element.id}
                        >
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="flex items-center justify-center ">
              <Form.Item label=" " className=" ">
                <div className="flex">
                  <Button
                    htmlType="button"
                    type="primary"
                    className="button_cancel"
                    onClick={closeBox}
                  >
                    キャンセル
                  </Button>
                  {/* ============================== */}
                  <Button htmlType="button" type="primary" className="button_preview mx-3">
                    プレビュー
                  </Button>
                  {/* =============================== */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button_save"
                    style={{ letterSpacing: '-1px' }}
                  >
                    <span>追加</span>
                  </Button>
                </div>
              </Form.Item>
            </div>
          </Form>
        </div>
      ) : null}
    </div>
  )
}

export default index

index.propTypes = {
  id: PropTypes.number.isRequired,
}
