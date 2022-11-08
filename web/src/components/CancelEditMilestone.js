import { Modal, Button } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

class CancelEditMilestone extends React.Component {
  state = {
    visible: false,
  };

  showModal = (curNameInput, curTimeInput, prevNameInput, prevTimeInput) => {
    if (curNameInput === prevNameInput && curTimeInput === prevTimeInput) {
      window.location.href = '/milestones'
      return
    }
    this.setState({
      visible: true,
    })
  };

  handleOk = () => {
    window.location.href = '/milestones'
    this.setState({ visible: false })
  };

  handleCancel = () => {
    this.setState({ visible: false })
  };

  render() {
    const { visible } = this.state
    return (
      <>
        <Button onClick={() => this.showModal(this.props.curNameInput, this.props.curTimeInput, this.props.prevNameInput, this.props.prevTimeInput)}>
          キャンセル
        </Button>
        <Modal
          visible={visible}
          title="マイルストーン編集"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
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
export default CancelEditMilestone

CancelEditMilestone.propTypes = {
  curNameInput: PropTypes.string.isRequired,
  curTimeInput: PropTypes.string.isRequired,
  prevNameInput: PropTypes.string.isRequired,
  prevTimeInput: PropTypes.string.isRequired,
}
