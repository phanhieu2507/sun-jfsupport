import { ContentState, convertToRaw, EditorState, convertFromHTML } from 'draft-js'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
// import handlePastedText from '../../utils/handleOnPaste'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { MemberApi } from '../../api/member'
import FileAdder from './FileAdder'
import './styles.scss'
import TodoList from './TodoList'

const Editor = dynamic(() => import('react-draft-wysiwyg').then((module) => module.Editor), {
  ssr: false,
  suspense: true,
})

function index(props) {
  const [commentContent, setCommentContent] = useState(props.value || '')
  const oldComment = EditorState.createWithContent(
    ContentState.createFromBlockArray(
      convertFromHTML(`${props.value}`),
    ),
  )
  const [editorState, setEditorState] = useState(props.value ? oldComment : '')
  // const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [usersName, setUsersName] = useState([])
  /* onchange */
  const onEditorStateChange = async (state) => {
    setEditorState(state)
    const res = await import('draftjs-to-html')
    const data = res.default(convertToRaw(state.getCurrentContent()))
    props.onChange(data || '')
  }
  const setEditorStateWhenEditing = async (data) => {
    const convertMarkdown2Draft = await import('html-to-draftjs').then((module) => module.default)
    const blocksFromHtml = convertMarkdown2Draft(data || '')
    const { contentBlocks, entityMap } = blocksFromHtml
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
    // eslint-disable-next-line
    const newEditorState = EditorState.createWithContent(contentState) 
    // setEditorState(newEditorState)
  }
  const getAllUser = async () => {
    const res = await MemberApi.getListMember()
    const names = res.data.map((user) => ({
      text: user.name,
      value: user.name,
      url: `/members/${user.id}`,
    }))
    setUsersName(names)
  }

  useEffect(() => {
    getAllUser()
    setEditorStateWhenEditing(commentContent)
    return () => setEditorState(EditorState.createEmpty())
  }, [])
  useEffect(() => {
    setEditorStateWhenEditing(props.value || '')
    setCommentContent(props.value)
  }, [props.value])

  const mention = {
    separator: ' ',
    trigger: '@',
    suggestions: usersName,
  }

  const hashtag = {
    separator: ' ',
    trigger: '#',
    suggestions: usersName,
  }

  return (
    <div className="editor bg-[#F8F9FA]">
      <div className="flex">
        <p className="text-xs italic text-[#888888] mr-5">@ for tag </p>
        <p className="text-xs italic text-[#888888]"># for hashtag</p>
      </div>
      <Editor
        toolbar={{
          options: [
            'inline',
            'blockType',
            'list',
            'textAlign',
            'colorPicker',
            'link',
            'embedded',
            'emoji',
            'image',
            'history',
          ],
          image: {
            urlEnabled: true,
            uploadEnabled: true,
            previewImage: true,
            // image: { uploadCallback: _uploadImageCallBack },
            alt: { present: false, mandatory: false },
          },
        }}
        editorState={editorState}
        toolbarClassName=""
        mention={mention}
        // mention={files}
        hashtag={hashtag}
        wrapperClassName="border rounded-md"
        editorClassName="editor__textarean pb-5 px-5 h-full border max-h-96 max-w-94 overflow-hidden"
        onEditorStateChange={onEditorStateChange}
        handlePastedText={() => false}
        toolbarCustomButtons={[
          <TodoList onChange={onEditorStateChange} editorState={editorState} checked />,
          <TodoList onChange={onEditorStateChange} editorState={editorState} checked={false} />,
          <FileAdder jfID={props.jfID} editorState={editorState} onChange={onEditorStateChange} />,
        ]}
      />
    </div>
  )
}
index.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  jfID: PropTypes.string,
}
export default index
