import { Modal, Button } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

class CancelEditTemplateTask extends React.Component {
  state = {
    visible: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = () => {
    window.location.href = `/template-tasks/${this.props.id}`
    this.setState({ visible: false })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  render() {
    const { visible } = this.state
    return (
      <>
        <Button onClick={this.props.confilm ? this.showModal : this.handleOk} className="text-base">
          キャンセル
        </Button>
        <Modal
          visible={visible}
          title="マイルストーン編集"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              いいえ
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              はい
            </Button>,
          ]}
        >
          <p>変更内容が保存されません。よろしいですか？</p>
        </Modal>
      </>
    )
  }
}
export default CancelEditTemplateTask

CancelEditTemplateTask.propTypes = {
  id: PropTypes.string.isRequired,
  confilm: PropTypes.bool.isRequired,
}
