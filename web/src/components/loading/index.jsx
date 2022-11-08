import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import './style.scss'

export const loadingIcon = <LoadingOutlined style={{ fontSize: 30, color: '#ffd803' }} spin />
function Loading(props) {
  return (
    <div
      className="overlay relative inset-0 h-full w-full"
      style={{ display: `${props.overlay ? 'block' : 'none'}` }}
    >
      <Spin
        spinning={props.loading ?? true}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        indicator={loadingIcon}
        size="large"
      />
    </div>
  )
}
Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  overlay: PropTypes.bool.isRequired,
}
export default Loading
