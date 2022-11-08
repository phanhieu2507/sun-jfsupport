import React, { useEffect } from 'react'
import Link from 'next/link'
import { List, Select, Form } from 'antd'
import {
  FileDoneOutlined,
  DeleteTwoTone,
  CloseOutlined,
} from '@ant-design/icons'
import './styles.scss'

function jfScheduleEditList({
  templateTaskChildernList,
  addedTemplateTaskChildernList,
  templateTaskOptions,
  onDeleteTemplateTask,
  onDeleteAllTemplateTask,
  onDeleteMilestone,
  onAddTemplateTask,
  milestone,
  form,
  selectName,
}) {
  useEffect(() => {
    const temp = {}
    temp[selectName] = addedTemplateTaskChildernList
    form.setFieldsValue(temp)
  }, [addedTemplateTaskChildernList])

  const onValueSelectChange = (value) => {
    const temp = {}
    temp[selectName] = value
    form.setFieldsValue(temp)
  }

  const selectTemplateTaskProps = {
    mode: 'multiple',
    optionFilterProp: 'label',
    style: { width: '90%' },
    value: addedTemplateTaskChildernList,
    options: templateTaskOptions,
    onSelect: (id) => {
      onAddTemplateTask(id)
    },
    onDeselect: (id) => {
      onDeleteTemplateTask(id)
    },
    placeholder: 'テンプレートタスクを入力してください。',
    maxTagCount: 'responsive',
    size: 'large',
    showArrow: true,
  }

  const dataList = templateTaskChildernList.filter((templateTask) => addedTemplateTaskChildernList.includes(templateTask.id))

  const renderHeader = ({ id, name }) => (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <FileDoneOutlined style={{ fontSize: 32 }} />
        <span className="ml-4 text-lg">{name}</span>
      </div>
      <Form.Item
        name={selectName}
        rules={[
          {
            required: true,
            message: 'テンプレートタスクを入力してください。',
          },
        ]}
        className="w-1/2 m-0"
        shouldUpdate
      >
        <div className="flex justify-items-end items-center">
          <Select {...selectTemplateTaskProps} onChange={onValueSelectChange} />
          <CloseOutlined
            style={{ fontSize: '24px' }}
            className="ml-5"
            onClick={() => {
              onDeleteMilestone(id)
              onDeleteAllTemplateTask(addedTemplateTaskChildernList)
            }}
          />
        </div>
      </Form.Item>
    </div>
  )

  return (
    <List
      bordered
      header={renderHeader(milestone)}
      dataSource={dataList}
      renderItem={(templateTask) => (
        <List.Item>
          <div className="flex justify-between w-full">
            <Link href={`/template-tasks/${templateTask.id}`}>
              <a>{templateTask.name}</a>
            </Link>
            <DeleteTwoTone
              onClick={() => {
                onDeleteTemplateTask(templateTask.id)
              }}
              style={{ fontSize: '14px' }}
            />
          </div>
        </List.Item>
      )}
    />
  )
}

export default jfScheduleEditList
