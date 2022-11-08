/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import { Modal, Space, notification } from 'antd'
import { ExclamationCircleOutlined, DeleteTwoTone } from '@ant-design/icons'

import { useRouter } from 'next/router'
import { deleteCategory } from '../../api/category'

const { confirm } = Modal

const DeleteCategory = (props) => {
  const role = props.role
  const router = useRouter()
  const setReloadPage = () => {
    props.reloadPage()
  }
  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
    })
    setReloadPage()
  }
  // eslint-disable-next-line no-unused-vars
  function showDeleteConfirm() {
    confirm({
      title: '削除カテゴリ',
      icon: <ExclamationCircleOutlined />,
      content: 'このカテゴリを削除してもよろしいですか？',
      okText: '保存',

      cancelText: 'キャンセル',
      centered: true,
      onOk() {
        if (role === 'superadmin') {
          try {
            deleteCategory(props.record.id)
            openNotificationSuccess()
          } catch (error) {
            if (error.response.status === 404) {
              router.push('/404')
            }
          }
        }
      },
      onCancel() {
      },
      okButtonProps: { style: { letterSpacing: '-0.1em' } },
    })
  }

  return (
    <div>
      <Space>
        {/* <DeleteTwoTone onClick={showDeleteConfirm} /> */}
        <DeleteTwoTone />
      </Space>
    </div>
  )
}

export default DeleteCategory
