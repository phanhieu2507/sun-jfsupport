/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import './style.scss'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import MilestoneItem from './milestoneItem'
import { listmilestone } from '../../api/jf-toppage'

export default function ChartMilestone({ id }) {
  const [listTask, setlistTask] = useState([])
  const router = useRouter()
  const fetchTasks = async () => {
    await listmilestone(id).then((response) => {
      setlistTask(response.data)
    }).catch((error) => {
      if (error.response.status === 404) {
        router.push('/404')
      }
    })
  }
  useEffect(() => {
    fetchTasks()
  }, [])

  const listData = listTask.map((item) => (
    <MilestoneItem listTask={item.task} milestoneName={item.name} dealine={item.is_week ? `残り : ${item.period} 週間` : `残り : ${item.period} 日`} />
  ))
  return (
    <div>
      {listData}
    </div>
  )
}
ChartMilestone.propTypes = {
  id: PropTypes.number.isRequired,
}
