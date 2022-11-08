import React from 'react'
import PropTypes from 'prop-types'
import ScheduleGantt from '../../../../components/schedule-gantt/index'

function GanttChart({ id }) {
  return (
    <div>
      <ScheduleGantt id={id} />
    </div>
  )
}
GanttChart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default GanttChart
