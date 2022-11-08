import { Modal, Button } from 'antd'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import _ from 'lodash'
import './styles.scss'

const JfScheduleCancelButton = ({ beforeEditData, editedData }) => {
  const [isModalVisible, setModalVisible] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    if (_.isEqual(beforeEditData, editedData)) {
      router.push('/schedules')
    } else {
      setModalVisible(true)
    }
  }

  const handleOk = () => {
    router.push('/schedules')
    setModalVisible(false)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  return (
    <>
      <Button size="large" onClick={handleClick} className="w-32">
        キャンセル
      </Button>
      <Modal
        centered
        visible={isModalVisible}
        title="JFスケジュール編集"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button size="large" key="back" onClick={handleCancel}>
            いいえ
          </Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOk}>
            はい
          </Button>,
        ]}
      >
        <p>変更内容が保存されません。よろしいですか？</p>
      </Modal>
    </>
  )
}

JfScheduleCancelButton.propTypes = {
  beforeEditData: PropTypes.object.isRequired,
  editedData: PropTypes.object.isRequired,
}

export default JfScheduleCancelButton
