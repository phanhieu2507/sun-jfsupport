import React from 'react'
import { Avatar, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import 'antd/dist/antd.css'

const AvatarKanban = ({ user }) => (
  <Avatar.Group maxCount={4}>
    {user.map((el, id) => {
      const { uName, userId } = el
      return (
        <Tooltip key={id.toString()} placement="bottom" title={<p>{uName}</p>}>
          <Avatar src={`../api/avatar/${userId}`} />
        </Tooltip>
      )
    })}
  </Avatar.Group>
)
AvatarKanban.propTypes = {
  user: PropTypes.array.isRequired,
}

export default AvatarKanban
