import { Modal, Button } from 'antd'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'

const CancelEditProfile = ({ currData, inputData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const router = useRouter()

  const isInputChange = () => {
    if (currData.name === inputData.name
      && currData.email === inputData.email
      && currData.idSlack === inputData.idSlack
      && currData.avatar === inputData.avatar) {
      return false
    }
    return true
  }

  const cancelEditProfile = () => {
    if (isInputChange()) {
      setIsModalVisible(true)
    } else {
      router.push('/profile/')
    }
  }

  const handleOk = () => {
    setIsModalVisible(false)
    router.push('/profile/')
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Button
        size="large"
        onClick={cancelEditProfile}
        className="text-base px-8 mr-2"
        style={{ backgroundColor: '#fff' }}
      >
        キャンセル
      </Button>
      <Modal
        visible={isModalVisible}
        title="プロフィール編集"
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        cancelText="いいえ"
        okText="はい"
      >
        <p>変更内容が保存されません。よろしいですか？</p>
      </Modal>
    </>
  )
}

CancelEditProfile.propTypes = {
  currData: PropTypes.object.isRequired,
  inputData: PropTypes.object.isRequired,
}
export default CancelEditProfile
