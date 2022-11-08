import React, { useEffect, useState } from 'react'
import {
  Modal,
  Select,
  Button,
  notification,
  Tag,
} from 'antd'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { getCategorys } from '../../api/edit-task'
import { updateManagerTask } from '../../api/task-detail'
import { listTaskWithParent } from '../../api/jf-toppage'
// eslint-disable-next-line react/prop-types
export default function EditUserAssignee({ setLoading, loadTableData, record, setRowEdit, setIsEdit }) {
  // eslint-disable-next-line react/prop-types
  const router = useRouter()
  const [memberCategory, setMemberCategory] = useState()
  const [AllMemberAS, setAllMemberAs] = useState()
  const [valueMember, setValueMember] = useState(record.managers)
  const [isChange, setIsChange] = useState(false)
  const saveEditNotification = () => {
    notification.success({
      duration: 3,
      message: '変更は正常に保存されました。',
      onClick: () => {},
    })
  }
  const fetchCTGR = async () => {
    await getCategorys().then((response) => {
      let dataUser = []
      // eslint-disable-next-line array-callback-return
      response.data.forEach((element) => {
        if (record.idCategory.includes(element.id)) {
          dataUser = dataUser.concat(element.users)
          setAllMemberAs(dataUser)
        }
      })
      // eslint-disable-next-line react/prop-types
      const data = dataUser.filter((e) => !record.managers.includes(e.name))
      setMemberCategory(data)
    })
  }
  function tagRender(props) {
    // eslint-disable-next-line react/prop-types
    const { label, closable, onClose, value } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={() => {
          onClose()
          // eslint-disable-next-line react/prop-types
          const data = AllMemberAS.filter((e) => value.includes(e.name))
          const newData = memberCategory.concat(data)
          const uniqueSet = new Set(newData)
          const uniqueArray = [...uniqueSet]
          setMemberCategory(uniqueArray)
          // setIsChange(true)
        }}
      >
        <span className="text-blue-600 icon-tag">{label}</span>
      </Tag>
    )
  }

  const handleSave = async () => {
    const newData = []
    // eslint-disable-next-line array-callback-return
    AllMemberAS.map((item) => {
      if (valueMember.includes(item.name)) {
        newData.push(item.id)
      }
    })
    const data = {
      assignee: newData,
    }
    setLoading(true)
    try {
      await updateManagerTask(record.idtask, data).then((response) => {
        if (response.data.warning === true) {
          notification.warning({
            duration: 3,
            message: response.data.message,
            onClick: () => {},
          })
        } else saveEditNotification()
      })
      await listTaskWithParent(router.query.id).then((response) => {
        loadTableData(response)
      })
      setLoading(false)
      setRowEdit(null)
      setIsEdit(false)
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
      setLoading(false)
      setRowEdit(null)
      setIsEdit(false)
    }
  }
  useEffect(() => {
    fetchCTGR()
  }, [])
  return (
    <div>
      <>
        <Select
          mode="multiple"
          onChange={(value) => {
            setValueMember(value)
            setIsEdit(true)
            setIsChange(true)
          }}
          style={{ width: '100%' }}
          defaultValue={record.managers}
          showArrow
          // eslint-disable-next-line react/jsx-no-bind
          tagRender={tagRender}
        >
          {memberCategory ? memberCategory.map((item) => (
            <Select.Option className="validate-user" key={item.name} value={item.name}>
              {item.name}
            </Select.Option>
          )) : null}
        </Select>
        <div className="save">
          <Button
            onClick={() => {
              if (isChange) {
                Modal.confirm({
                  title: '変更内容が保存されません。よろしいですか？',
                  icon: <ExclamationCircleOutlined />,
                  content: '',
                  centered: true,
                  okText: 'はい',
                  cancelText: 'いいえ',
                  onOk: () => {
                    setRowEdit(null)
                    setIsEdit(false)
                    setIsChange(false)
                  },
                })
              } else {
                setRowEdit(null)
                setIsEdit(false)
              }
            }}
            style={{
              marginRight: '10px',
              background: 'white',
              height: '30px',
              padding: '0 15px',
            }}
            size="small"
            type="primary"
          >
            <span> キャンセル </span>
          </Button>
          <Button
            onClick={() => {
              handleSave()
            }}
            style={{ height: '30px', padding: '0 15px', zIndex: '99999' }}
            size="small"
            type="primary"
          >
            <span> 保存 </span>
          </Button>
        </div>
      </>
    </div>
  )
}
EditUserAssignee.propTypes = {
  record: PropTypes.object.isRequired,
}
