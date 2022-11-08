/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
import React from 'react'
import ReactQuill from 'react-quill'
import './style.scss'

const CustomToolbar = ({ fileSelect }) => (
  <div id="toolbar">
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
      <button className="ql-blockquote" />
    </span>
    <span className="ql-formats">
      <select className="ql-color" />
      <select className="ql-background" />
    </span>
    <span className="ql-formats">
      <button className="ql-code-block" />
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-list" value="check" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
    </span>
    <span className="ql-formats">
      <button className="ql-link" />
    </span>
    {
      fileSelect.state ? (
        <span className="ql-formats">
          <select className="ql-fileSelector" placeholder="Select file">
            {
              fileSelect.fileData.map((file) => <option value={file.id} key={file.id}>{file.name}</option>)
            }
          </select>
        </span>
      ) : ''
    }
  </div>
)

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modules: {
        toolbar: {
          container: '#toolbar',
        },
      },
    }
    this.handleChangeEditorText = this.handleChangeEditorText.bind(this)
    this.reactQuillRef = null
  }

  componentDidMount() {
    if (this.props.fileSelect?.state) {
      document.querySelector('.ql-fileSelector .ql-picker-label').innerHTML = `ファイル選択${document.querySelector('.ql-fileSelector .ql-picker-label').innerHTML}`
      document.querySelector('.ql-fileSelector').querySelector('.ql-picker-item')?.classList?.remove('ql-selected')
      this.setState({
        modules: {
          toolbar: {
            container: '#toolbar',
            handlers: {
              fileSelector: (args) => this.fileSelector(args),
            },
          },
        },
      })
    }
    if (this.props.readOnly) {
      this.setState({
        modules: {
          toolbar: false,
        },
      })
    }
  }

  handleChangeEditorText(value) {
    this.props.setEditorText(value)
  }

  fileSelector(args) {
    const quill = this.reactQuillRef.getEditor()
    const value = this.props.fileSelect.fileData.find((file) => file.id === parseInt(args, 10))
    const cursorPosition = quill.getSelection().index
    quill.insertText(cursorPosition, value.name, 'link', value.link)
    quill.setSelection(cursorPosition + value.name.length)
    const ele = document.querySelector('.ql-fileSelector').querySelectorAll('.ql-picker-item')
    ele.forEach((el) => {
      el?.classList.remove('ql-selected')
      return el
    })
  }

  render() {
    if (this.props.readOnly) {
      return (
        <div className="text-editor">
          <ReactQuill
            ref={(el) => { this.reactQuillRef = el }}
            value={this.props.editorText}
            // onChange={this.handleChangeEditorText}
            // placeholder={this.props.placeholder}
            modules={{
              toolbar: false,
            }}
            readOnly={this.props.readOnly}
          />
        </div>
      )
    }
    if (this.props.disableToolbar) {
      return (
        <div className="text-editor">
          <ReactQuill
            ref={(el) => { this.reactQuillRef = el }}
            value={this.props.editorText}
            onChange={this.handleChangeEditorText}
            // placeholder={this.props.placeholder}
            modules={{
              toolbar: false,
            }}
            readOnly={false}
          />
        </div>
      )
    }
    return (
      <div className="text-editor">
        <CustomToolbar fileSelect={this.props.fileSelect} />
        <ReactQuill
          ref={(el) => { this.reactQuillRef = el }}
          value={this.props.editorText}
          onChange={this.handleChangeEditorText}
          // placeholder={this.props.placeholder}
          modules={this.state.modules}
          readOnly={this.props.readOnly}
          fileSelect={this.props.fileSelect}
        />
      </div>
    )
  }
}

export default Editor
