import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'
import { Card, Button, Tooltip } from 'antd'
import { CalendarOutlined, LinkOutlined } from '@ant-design/icons'
import { formatDate } from '../../utils/utils'

import './styles.scss'
import AvatarKanban from './AvatarKanban'

const Task = (props) => {
  const { title, task, isControllable, index, idJf } = props
  const { taskName, memo, user, end_time: endTime, id } = task
  let memoStyle
  let cardBorderedStyle

  if (title === '未着手') {
    cardBorderedStyle = 'ant-card__bordered--未着手'
    memoStyle = 'memo--未着手'
  } else if (title === '進行中') {
    cardBorderedStyle = 'ant-card__bordered--進行中'
    memoStyle = 'memo--進行中'
  } else if (title === '完了') {
    cardBorderedStyle = 'ant-card__bordered--完了'
    memoStyle = 'memo--完了'
  } else if (title === '中断') {
    cardBorderedStyle = 'ant-card__bordered--中断'
    memoStyle = 'memo--中断'
  } else {
    cardBorderedStyle = 'ant-card__bordered--未完了'
    memoStyle = 'memo--未完了'
  }
  return (
    <Draggable draggableId={id.toString()} index={index} key={id}>
      {(provided) => (
        <div
          className="container__column--task"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={isControllable ? provided.innerRef : null}
        >
          <div className="mx-auto">
            <Card
              bordered={false}
              className={cardBorderedStyle}
              style={{ marginBottom: '5px' }}
            >
              <div style={{ display: '-ms-flexbox', justifyContent: 'start' }}>
                <div className="text-lg mb-2">
                  <a href={`/jobfairs/${idJf}/tasks/${id}`}>{taskName}</a>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {memo && (
                    <Button className={memoStyle}>
                      <Tooltip
                        placement="bottom"
                        title={<p>{memo}</p>}
                        className="m-1 flex justify-center"
                      >
                        <span
                          style={{
                            color: 'white',
                            marginTop: '-10px',
                          }}
                        >
                          メモ
                        </span>
                      </Tooltip>
                    </Button>
                  )}
                  {(user[0].uName !== undefined) ? <AvatarKanban user={user} /> : '' }

                </div>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  marginTop: '5px',
                  alignItems: 'center',
                }}
              >
                <div
                  className="border m-1 user"
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <CalendarOutlined />
                  &nbsp;
                  {' '}
                  {formatDate(endTime)}
                </div>
                <Tooltip
                  placement="bottom"
                  title={<a>関連リンク</a>}
                  trigger="click"
                  className="m-1 flex justify-center"
                >
                  <LinkOutlined />
                </Tooltip>
              </div>
            </Card>
          </div>
        </div>
      )}
    </Draggable>
  )
}

Task.propTypes = {
  title: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired,
  isControllable: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  idJf: PropTypes.number.isRequired,
}

export default Task
