/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import './style.scss'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
// import { jftask } from '../../api/jf-toppage'
export default function ChartStatus({ task, id }) {
  const listStatus = []
  task.forEach((element) => {
    listStatus.push(element.status)
  })
  const router = useRouter()
  const status = {
    new: listStatus.filter((value) => value === '未着手').length.toString(),
    propress: listStatus.filter((value) => value === '進行中').length.toString(),
    done: listStatus.filter((value) => value === '完了').length.toString(),
    pending: listStatus.filter((value) => value === '中断').length.toString(),
    break: listStatus.filter((value) => value === '未完了').length.toString(),
  }
  const total = Number(status.new) + Number(status.propress) + Number(status.done) + Number(status.pending) + Number(status.break)
  const width = {
    new: ((Number(status.new) / total) * 100).toString(),
    propress: ((Number(status.propress) / total) * 100).toString(),
    done: ((Number(status.done) / total) * 100).toString(),
    pending: ((Number(status.pending) / total) * 100).toString(),
    break: ((Number(status.break) / total) * 100).toString(),
  }
  return (
    <>
      <div className="Status">
        <div className="flex justify-center ...">
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
        <div className="flex justify-center ...">
          <div className="name__stt">
            <div className="stt__If">
              <div className="new__if">
                未着手
              </div>
              <span onClick={() => { router.push(`/jobfairs/${id}/tasks?status=未着手`) }} style={{ background: '#5EB5A6', cursor: 'pointer' }}>{status.new}</span>
            </div>
            <div className="stt__If">
              <div className="new__if">
                進行中
              </div>
              <span onClick={() => { router.push(`/jobfairs/${id}/tasks?status=進行中`) }} style={{ background: '#A1AF2F', cursor: 'pointer' }}>{status.propress}</span>
            </div>
            <div className="stt__If">
              <div className="new__if">
                完了
              </div>
              <span onClick={() => { router.push(`/jobfairs/${id}/tasks?status=完了`) }} style={{ background: '#4488C5', cursor: 'pointer' }}>{status.done}</span>
            </div>
            <div className="stt__If">
              <div className="new__if">
                中断
              </div>
              <span onClick={() => { router.push(`/jobfairs/${id}/tasks?status=中断`) }} style={{ background: 'rgb(185, 86, 86)', cursor: 'pointer' }}>{status.pending}</span>
            </div>
            <div className="stt__If">
              <div className="new__if">
                未完了
              </div>
              <span onClick={() => { router.push(`/jobfairs/${id}/tasks?status=未完了`) }} style={{ background: 'rgb(121, 86, 23)', cursor: 'pointer' }}>{status.break}</span>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
ChartStatus.propTypes = {
  task: PropTypes.array.isRequired,
}
ChartStatus.propTypes = {
  id: PropTypes.number.isRequired,
}
