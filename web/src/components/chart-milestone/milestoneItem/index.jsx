/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import './style.scss'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'

export default function MilestoneItem({ milestoneName, dealine, listTask }) {
  const listStatus = []
  listTask.forEach((element) => {
    listStatus.push(element.status)
  })
  const status = {
    new: listStatus.filter((value) => value === '未着手').length.toString(),
    propress: listStatus.filter((value) => value === '進行中').length.toString(),
    done: listStatus.filter((value) => value === '完了').length.toString(),
    pending: listStatus.filter((value) => value === '中断').length.toString(),
    break: listStatus.filter((value) => value === '未完了').length.toString(),
  }
  const total = Number(status.new)
    + Number(status.propress)
    + Number(status.done)
    + Number(status.pending)
    + Number(status.break)
  const width = {
    new: ((Number(status.new) / total) * 100).toString(),
    propress: ((Number(status.propress) / total) * 100).toString(),
    done: ((Number(status.done) / total) * 100).toString(),
    pending: ((Number(status.pending) / total) * 100).toString(),
    break: ((Number(status.break) / total) * 100).toString(),
  }
  return (
    <>
      <div className="milestone__Item">
        <div className="Mile__title">
          <Tooltip title={milestoneName}>
            <h5 className="mile__name" style={{ color: '#2d334a' }}>{milestoneName}</h5>
          </Tooltip>
          <h5 style={{ color: '#2d334a' }}>{dealine}</h5>
        </div>
        <div className="mile__chart">
          <div className="chart__stt">
            <Tooltip placement="top" title="未着手">
              <div className="new" style={{ width: `${width.new}%` }} />
            </Tooltip>
            <Tooltip placement="top" title="進行中">
              <div className="in__propress" style={{ width: `${width.propress}%` }} />
            </Tooltip>
            <Tooltip placement="top" title="完了">
              <div className="done" style={{ width: `${width.done}%` }} />
            </Tooltip>
            <Tooltip placement="top" title="中断">
              <div className="pending" style={{ width: `${width.pending}%` }} />
            </Tooltip>
            <Tooltip placement="top" title="未完了">
              <div className="break" style={{ width: `${width.break}%` }} />
            </Tooltip>

          </div>

        </div>
      </div>
    </>
  )
}
MilestoneItem.propTypes = {
  milestoneName: PropTypes.string.isRequired,
}
MilestoneItem.propTypes = {
  dealine: PropTypes.string.isRequired,
}
MilestoneItem.propTypes = {
  listTask: PropTypes.array.isRequired,
}
