import React from 'react'
import { Button } from 'antd'
import './styles.scss'
import Link from 'next/link'
import PropTypes from 'prop-types'

export default class TaskControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="flex justify-center mb-5 ml-40">
        <Link href={`/members/${this.props.id}/tasks`}>
          <Button type="primary" size="large" className="mr-2">
            タスクー覧
          </Button>
        </Link>
        <Link href={`/members/${this.props.id}/gantt-chart`}>
          <Button type="primary" size="large" className="mr-2">
            ガンチャート
          </Button>
        </Link>
      </div>
    )
  }
}
TaskControl.defaultProps = {
  id: 0,
}
TaskControl.propTypes = {
  id: PropTypes.number,
}
