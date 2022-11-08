import React from 'react'
import PropTypes from 'prop-types'
import { Droppable } from 'react-beautiful-dnd'
import dynamic from 'next/dynamic'
import './styles.scss'
import 'antd/dist/antd.css'

const Task = dynamic(() => import('./Task'), {
  loading: () => <p />,
  ssr: false,
})

const Column = ({ column, tasks, idJf }) => {
  const { id, title } = column

  let borderBottomStyle

  if (title === '未着手') {
    borderBottomStyle = '2px solid #5EB5A6'
  } else if (title === '進行中') {
    borderBottomStyle = '2px solid #A1AF2F'
  } else if (title === '完了') {
    borderBottomStyle = '2px solid #4488C5'
  } else if (title === '中断') {
    borderBottomStyle = '2px solid rgb(185, 86, 86)'
  } else {
    borderBottomStyle = '2px solid rgb(121, 86, 23)'
  }

  let containerColumnList

  if (title === '未着手') {
    containerColumnList = 'container__column--list 未着手'
  } else if (title === '進行中') {
    containerColumnList = 'container__column--list 進行中'
  } else if (title === '完了') {
    containerColumnList = 'container__column--list 完了'
  } else if (title === '中断') {
    containerColumnList = 'container__column--list 中断'
  } else {
    containerColumnList = 'container__column--list 未完了'
  }
  return (
    <div className="container__column">
      <h3
        style={{
          paddingBottom: '10px',
          borderBottom: borderBottomStyle,
          width: '95%',
        }}
      >
        {title}
        {' '}
        <span style={{ opacity: '0.4' }}>|</span>
        {' '}
        {tasks.length}
      </h3>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={containerColumnList}
          >
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                title={title}
                idJf={idJf}
                isControllable
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
Column.propTypes = {
  tasks: PropTypes.array.isRequired,
  column: PropTypes.object.isRequired,
  idJf: PropTypes.number.isRequired,
}

export default Column
