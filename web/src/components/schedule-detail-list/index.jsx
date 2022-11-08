import React from 'react'
import { Button } from 'antd'
import { RightCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import PropTypes from 'prop-types'
import Navbar from '../navbar/index'

function ScheduleDetailHeader({ id }) {
  return (
    <div>
      <Navbar className="navbar" />
      <div className="px-12">
        <div className="flex justify-between mt-5 mb-4">
          <Link href="/schedules">
            <Button type="primary" id="back_btn">
              戻る
            </Button>
          </Link>
          <Link href={`/schedules/${id}/gantt`}>
            <RightCircleOutlined className="gantt-chart text-4xl gantt-chart_btn" />
          </Link>
        </div>
        <span className="text-3xl inline-block mb-4 " id="title">
          JFスケジュール詳細
        </span>
      </div>
    </div>
  )
}
ScheduleDetailHeader.propTypes = {
  id: PropTypes.string.isRequired,
}

export default ScheduleDetailHeader
