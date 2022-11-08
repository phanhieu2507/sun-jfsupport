import { FolderAddFilled } from '@ant-design/icons'
import { Button, Modal, Form, Input, notification } from 'antd'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { addDocument } from '../../../api/file'
import './style.scss'

export default function ButtonAddFolder(props) {
  const [isDisableFolder, setIsDisableFolder] = useState(true)
  const [nameFolder, setNameFolder] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const router = useRouter()
  const setNull = () => {
    setNameFolder('')
    form.setFieldsValue({ name_folder: '' })
  }

  const handleCancel = () => {
    setNull()
    setIsModalVisible(false)
  }

  useEffect(() => {
    if (nameFolder === '') {
      setIsDisableFolder(true)
    }
  }, [nameFolder])

  const openNotificationSuccess = () => {
    setIsModalVisible(false)
    notification.success({
      message: '新しいフォルダを追加しました。',
      duration: 3,
    })
  }

  const onNameFolderChange = (e) => {
    setIsDisableFolder(false)
    setNameFolder(e.target.value)
  }

  const handleFolderOk = async () => {
    let queryPath = ''
    for (let i = 0; i < props.path.length; i += 1) {
      if (i !== 0 && i !== props.path.length - 1) {
        queryPath += `${props.path[i]}/`
      } else if (i === 0) {
        queryPath += '/'
      } else {
        queryPath += props.path[i]
      }
    }

    try {
      const res = await addDocument({
        name: nameFolder,
        path: queryPath,
        is_file: 0,
        link: '',
        document_id: props.documentId,
      })
      if (res.data.name) {
        if (res.data.name[0] === 'The name has already been taken.') {
          setIsDisableFolder(true)
          form.setFields([
            {
              name: 'name_folder',
              errors: ['このファイル名は既に使用されています。'],
            },
          ])
        }
      } else {
        const result = res.data.map((element) => ({
          key: element.id,
          checkbox: props.updater.get('id') === element.authorId || props.role !== 'member',
          is_file: element.is_file,
          name: element.name,
          updater: element.updaterName,
          updated_at: element.updated_at,
          link: element.link,
        }))
        if (props.path.length > 1) {
          props.setData([
            {
              key: -1,
              name: '..',
              checkbox: false,
              is_file: false,
              updater: '',
              updated_at: '',
              link: '',
            },
            ...result,
          ])
        } else props.setData(result)
        props.setIsCheckAll(false)
        openNotificationSuccess()
        setNull()
      }
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
      props.setIsCheckAll(false)
      setNull()
    }
  }

  return (
    <div className="file-add">
      <Button
        type="primary"
        shape="round"
        size="large"
        icon={<FolderAddFilled />}
        onClick={() => setIsModalVisible(true)}
      >
        新しいフォルダ
      </Button>
      <Modal
        title="新しいフォルダ"
        okText="保存"
        cancelText="キャンセル"
        centered
        visible={isModalVisible}
        onOk={handleFolderOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: isDisableFolder }}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          className="add"
          name="basic"
          colon={false}
        >
          <Form.Item
            label={(
              <span className="font-bold mr-3">
                名前
              </span>
            )}
            name="name_folder"
            rules={[
              {
                required: true,
                message: 'この項目は必須です。',
              },
            ]}
          >
            <Input
              type="text"
              size="large"
              onChange={onNameFolderChange}
              placeholder="新しいフォルダ名"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

ButtonAddFolder.propTypes = {
  updater: PropTypes.isRequired,
  role: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  documentId: PropTypes.isRequired,
  setData: PropTypes.isRequired,
  setIsCheckAll: PropTypes.isRequired,
}
