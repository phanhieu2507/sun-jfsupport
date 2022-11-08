import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'

function StatusStatic(props) {
  return (
    <>
      {`${props.status}` === '未着手' ? (
        <span
          style={{
            background: '#5EB5A6',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          {`${props.status}`}
        </span>
      ) : null}
      {`${props.status}` === '進行中' ? (
        <span
          style={{
            background: '#A1AF2F',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          {`${props.status}`}
        </span>
      ) : null}
      {`${props.status}` === 'レビュー待ち' ? (
        <span
          style={{
            background: '#be00f8',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          {`${props.status}`}
        </span>
      ) : null}
      {`${props.status}` === '完了' ? (
        <span
          style={{
            background: '#4488C5',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          {`${props.status}`}
        </span>
      ) : null}
      {`${props.status}` === '中断' ? (
        <Tooltip title={props.memo} placement="right">
          <span
            style={{
              background: 'rgb(185, 86, 86)',
              color: '#fff',
              cursor: 'pointer',
            }}
            className=" stt item__right"
          >
            {`${props.status}`}
          </span>
        </Tooltip>
      ) : null}
      {`${props.status}` === '未完了' ? (
        <span
          style={{
            background: 'rgb(121, 86, 23)',
            color: '#fff',
          }}
          className=" stt item__right"
        >
          {`${props.status}`}
        </span>
      ) : null}
    </>
  )
}
StatusStatic.propTypes = {
  status: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  memo: PropTypes.string,
}
export default StatusStatic
