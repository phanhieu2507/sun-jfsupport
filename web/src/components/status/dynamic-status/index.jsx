import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Select } from 'antd'
import {
  EditOutlined,
} from '@ant-design/icons'
import { updateStatusMember } from '../../../api/task-detail'

function Status(props) {
  const [listStatus, setListStatus] = useState([])
  const [oldStatus, setOldStatus] = useState(props.status)
  let newStatus
  useEffect(() => {
    if (props.roleTask === 'jfadmin') {
      setListStatus(['進行中', 'リビュエー待ち', '完了', '中断', '未完了'])
    } else if (props.roleTask === 'reviewer') {
      setListStatus(['進行中', 'リビュエー待ち', '完了', '中断', '未完了'])
    } else {
      setListStatus(['未着手', '進行中', 'リビュエー待ち'])
    }
  }, [props.roleTask])
  const handleChange = (value) => {
    newStatus = value
  }
  const handleOk = async () => {
    await updateStatusMember(props.user_id, props.task_id, newStatus).then((res) => {
      setOldStatus(res.data.memberStatus)
      props.set_task_status(res.data.taskStatus)
    })
  }
  const modalChangeStatus = () => {
    Modal.confirm({
      title: 'ステータスを編集',
      width: 400,
      content: (
        <Select
          size="large"
          defaultValue={oldStatus}
          style={{ width: '300px' }}
          onChange={handleChange}
        >
          {listStatus.map((element) => (
            <Select.Option value={element}>{element}</Select.Option>
          ))}
        </Select>
      ),
      onOk() {
        handleOk()
      },
      onCancel() {},
      centered: true,
      okText: '編集',
      okButtonProps: { size: 'large' },
      cancelText: 'キャンセル',
      cancelButtonProps: { size: 'large' },
    })
  }
  return (
    <>
      {`${oldStatus}` === '未着手' ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: '#5EB5A6',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          <EditOutlined style={{ marginRight: '0px', paddingRight: '1px' }} />
          {`${oldStatus}`}
        </a>
      ) : null}
      {`${oldStatus}` === '進行中' ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: '#A1AF2F',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          <EditOutlined size="small" style={{ marginRight: '0px', paddingRight: '1px' }} />
          {`${oldStatus}`}
&nbsp;&nbsp;
        </a>
      ) : null}
      {`${oldStatus}` === '完了' ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: '#4488C5',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          <EditOutlined size="small" style={{ marginRight: '0px', paddingRight: '1px' }} />
          {`${oldStatus}`}
&nbsp;&nbsp;
        </a>
      ) : null}
      {`${oldStatus}` === 'リビュエー待ち' ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: 'purple',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          <EditOutlined size="small" style={{ marginRight: '0px', paddingRight: '1px' }} />
          {`${oldStatus}`}
&nbsp;&nbsp;
        </a>
      ) : null}
      {`${oldStatus}` === '中断' ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: 'rgb(185, 86, 86)',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          <EditOutlined size="small" style={{ marginRight: '0px', paddingRight: '1px' }} />
          {`${oldStatus}`}
        </a>
      ) : null}
      {`${oldStatus}` === '未完了' ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: 'rgb(121, 86, 23)',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          <EditOutlined size="small" style={{ marginRight: '0px', paddingRight: '1px' }} />
          {`${oldStatus}`}
        </a>
      ) : null}
    </>
  )
}
Status.propTypes = {
  status: PropTypes.string.isRequired,
  user_id: PropTypes.number.isRequired,
  task_id: PropTypes.number.isRequired,
  set_task_status: PropTypes.func.isRequired,
  roleTask: PropTypes.string.isRequired,
}
export default Status
