import { EditorBlock, EditorState } from 'draft-js'
import PropTypes from 'prop-types'
import React from 'react'

const updateDataOfBlock = (editorState, block, newData) => {
  const contentState = editorState.getCurrentContent()
  const newBlock = block.merge({
    data: newData,
  })
  const newContentState = contentState.merge({
    blockMap: contentState.getBlockMap().set(block.getKey(), newBlock),
  })
  return EditorState.push(editorState, newContentState, 'change-block-type')
}
function TodoBlock(props) {
  const updateData = () => {
    const { block, blockProps } = props
    const { onChange, getEditorState } = blockProps
    const data = block.getData()
    const checked = data.has('checked') && data.get('checked') === true
    const newData = data.set('checked', !checked)
    onChange(updateDataOfBlock(getEditorState(), block, newData))
  }
  const data = props.block.getData()
  const checked = data.get('checked') === true
  return (
    <div>
      <div className={checked ? 'block-todo-completed flex items-center' : 'flex items-center'}>
        <input type="checkbox" checked={checked} onChange={updateData} />
        &nbsp;
        <p className="hidden">{'- [] '}</p>
        <EditorBlock {...props} />
      </div>
    </div>
  )
}

TodoBlock.propTypes = {
  block: PropTypes.object.isRequired,
  blockProps: PropTypes.object.isRequired,
}
export default TodoBlock
