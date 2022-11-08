import { Button } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useStackEdit } from 'use-stackedit'
import { editTask } from '../../api/edit-task'
import MarkDownView from '../markDownView'

const StackEditor = (props) => {
  const [description, setDescription] = useState(props.value || '')
  let def = ''
  const { openStackedit, onFileChange, onClose } = useStackEdit(setDescription)
  const saveData = async (des) => {
    const newDescription = { description_of_detail: des }
    await editTask(props.taskId, newDescription)
  }

  onFileChange((data) => {
    setDescription(data.content.text)
    def = data.content.text
  })
  onClose(() => {
    saveData(def)
  })
  useEffect(() => {
    setDescription(props.value ?? '')
  }, [props.value])
  return (
    <div>
      <MarkDownView source={description} linkTarget="_blank" />
      <Button
        type="primary"
        className="flex justify-center items-center"
        onClick={() => {
          openStackedit({
            content: {
              // Markdown content.
              text: description,
            },
          })
        }}
      >
        <p className="!m-0 !p-0"> 編集</p>
      </Button>
    </div>
  )
}
StackEditor.propTypes = {
  taskId: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}
export default StackEditor
