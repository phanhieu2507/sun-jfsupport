/* eslint-disable no-empty */
import { FileAddOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Select } from 'antd'
import { ContentState, convertFromHTML, EditorState } from 'draft-js'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { getLatest } from '../../api/file'

const { Option } = Select

function FileAdder(props) {
  const [formEditFile] = Form.useForm()

  const [files, setFiles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const showModalFn = () => {
    setShowModal(true)
  }

  const getAllFile = async (id) => {
    try {
      const res = await getLatest(id)
      if (res.data.length > 0) {
        setFiles(res.data)
      }
      return res.data
    } catch (err) {
      return []
    }
  }
  useEffect(() => {
    getAllFile(props.jfID)
  }, [props.jfID])
  const addNewFile = () => {
    showModalFn()
  }
  const onEditFileChange = () => {
    const nameFile = formEditFile.getFieldValue('name_file')
    const link = formEditFile.getFieldValue('link')

    if (!nameFile || !link) {
    }
  }
  const addLink = (link) => {
    const { editorState, onChange } = props
    const newBlockMap = convertFromHTML(link)
    const contentState = editorState.getCurrentContent()
    const blockMap = contentState.getBlocksAsArray()
    newBlockMap.contentBlocks = blockMap.concat(newBlockMap.contentBlocks)
    const newContentState = ContentState.createFromBlockArray(
      newBlockMap,
      contentState.getEntityMap(),
    )
    onChange(
      EditorState.moveSelectionToEnd(
        EditorState.push(editorState, newContentState, 'change-block-data'),
      ),
    )
  }
  const handleEditFileOk = () => {
    const nameInput = formEditFile.getFieldValue('name_file')
    const linkInput = formEditFile.getFieldValue('link')
    if (nameInput && linkInput) {
      const link = `<a href=${linkInput}>${nameInput}</a>`
      addLink(link)
      formEditFile.resetFields()
      setShowModal(false)
    }
  }
  const onFileSelect = (e, selected) => {
    // const link = `[${selected.children}](${selected.value})\n`
    const link = `<a href=${selected.value}>${selected.children}</a>`
    addLink(link)
  }
  return (
    <div className="m-2 flex items-center">
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a file"
        optionFilterProp="children"
        value="Select a file"
        onChange={onFileSelect}
      >
        {files.map((file) => (
          <Option key={file.id} value={file.link}>
            {file.name}
          </Option>
        ))}
      </Select>
      <Modal
        title="ファイル編集"
        okText="保存"
        cancelText="キャンセル"
        centered
        visible={showModal}
        onOk={handleEditFileOk}
        onCancel={() => {
          setShowModal(false)
        }}
      >
        <Form
          form={formEditFile}
          onValuesChange={onEditFileChange}
          layout="horizontal"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          name="basic"
          size="large"
        >
          <Form.Item
            label={<span className="font-bold mr-3">名前</span>}
            name="name_file"
            rules={[
              {
                required: true,
                message: 'この項目は必須です。',
              },
            ]}
          >
            <Input type="text" size="large" placeholder="新しいファイル名" />
          </Form.Item>

          <Form.Item
            label={<span className="font-bold mr-3">リンク</span>}
            name="link"
            rules={[
              {
                required: true,
                message: 'この項目は必須です。',
              },
            ]}
          >
            <Input type="text" size="large" placeholder="グーグルドライブリンク" />
          </Form.Item>
        </Form>
      </Modal>
      <div onClick={addNewFile} className="cursor-pointer">
        <FileAddOutlined className="mx-2 " style={{ fontSize: 24 }} />
      </div>
    </div>
  )
}
FileAdder.propTypes = {
  onChange: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
  jfID: PropTypes.string.isRequired,
}

export default FileAdder
