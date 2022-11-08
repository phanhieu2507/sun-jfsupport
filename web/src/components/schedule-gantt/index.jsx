/* eslint-disable no-empty */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { Table, Tooltip, Typography } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useRef } from 'react'
import { ArcherContainer, ArcherElement } from 'react-archer'
import { useVT } from 'virtualizedtableforantd4'
import { ListScheduleApi } from '~/api/schedule'
import './style.scss'
import colors from './_colors'

function ScheduleGantt({ id }) {
  // const [tasks, setTasks] = useState([])
  // const [milestones, setMilestones] = useState([])
  // const [categories, setCategories] = useState([])

  const TOTAL_ALL = 27
  const [dataSource, setDataSource] = useState([])
  const [milestoneC, setMilestoneC] = useState([])
  const refArcher = useRef(null)

  const [vt] = useVT(() => ({ scroll: { y: 550 } }), [])

  const filterByIds = (ids, records) => {
    const result = records.filter((item) => ids.includes(item.id))
    if (result.length !== 0) {
      return result
    }
    return []
  }
  const getTimeStart = (milestone) => {
    if (milestone.timestamp.includes('日後')) {
      return parseInt(milestone.timestamp, 10)
    }
    if (milestone.timestamp === '') {
      return 0
    }

    return parseInt(milestone.timestamp, 10) * 7
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await ListScheduleApi.getGanttChart(id)
        const { tasks, milestones, categories } = response.data

        let timeStart = {}
        let milestoneDur = {}
        let allChildIds = []
        let checkStart = false
        milestones.map((milestone) => {
          const start = getTimeStart(milestone)
          timeStart = { ...timeStart, [milestone.id]: start }
          if (!start) {
            checkStart = true
          }
          milestoneDur = { ...milestoneDur, [milestone.id]: 0 }
          return milestone
        })
        tasks.map((task) => {
          allChildIds = [...allChildIds, ...task.children]
          return task
        })
        const tmpDataSource = tasks
          .filter((task) => !allChildIds.includes(task.id))
          .map((task) => {
            if (
              task.duration + task.startAfter
              > milestoneDur[`${task.milestoneId}`]
            ) {
              milestoneDur = {
                ...milestoneDur,
                [task.milestoneId]: task.duration + task.startAfter,
              }
            }

            const tmpCategoriesTask = filterByIds(task.categoryIds, categories)
            const children = filterByIds(task.children, tasks)
            if (children.length !== 0) {
              return {
                ...task,
                key: task.id,
                categoryIds: tmpCategoriesTask,
                children: children.map((taskChild) => ({
                  key: taskChild.id,
                  id: taskChild.id,
                  name: taskChild.name,
                  milestoneId: taskChild.milestoneId,
                  categoryIds: filterByIds(taskChild.categoryIds, categories),
                  startAfter: taskChild.startAfter,
                  duration: taskChild.duration,
                  startTime:
                    timeStart[taskChild.milestoneId] + taskChild.startAfter,
                  endTime:
                    timeStart[taskChild.milestoneId]
                    + taskChild.startAfter
                    + taskChild.duration
                    - 1,
                  effort: taskChild.effort,
                  afterTask: taskChild.afterTask,
                })),
                startTime: timeStart[task.milestoneId] + task.startAfter,
                endTime:
                  timeStart[task.milestoneId]
                  + task.startAfter
                  + task.duration
                  - 1,
                afterTask: task.afterTask,
              }
            }
            return {
              id: task.id,
              key: task.id,
              name: task.name,
              milestoneId: task.milestoneId,
              categoryIds: tmpCategoriesTask,
              startAfter: task.startAfter,
              duration: task.duration,
              startTime: timeStart[task.milestoneId] + task.startAfter,
              endTime:
                timeStart[task.milestoneId]
                + task.startAfter
                + task.duration
                - 1,
              effort: task.effort,
              afterTask: task.afterTask,
            }
          })

        const tmpMilestoneC = milestones.map((milestone) => ({
          ...milestone,
          key: milestone.id,
          startTime: timeStart[milestone.id],
        }))

        tmpMilestoneC.sort((a, b) => getTimeStart(a) - getTimeStart(b))
        tmpDataSource.sort((a, b) => {
          if (a.milestoneId === b.milestoneId) {
            return a.startTime - b.startTime
          }
          return (
            getTimeStart(filterByIds([a.milestoneId], milestones)[0])
            - getTimeStart(filterByIds([b.milestoneId], milestones)[0])
          )
        })

        let tmpMilestone = tmpMilestoneC.map((milestone, index) => {
          if (index === tmpMilestoneC.length - 1) {
            return {
              ...milestone,
              duration: milestoneDur[milestone.id],
            }
          }
          return {
            ...milestone,
            duration: tmpMilestoneC[index + 1].startTime - milestone.startTime,
          }
        })

        if (!checkStart) {
          tmpMilestone = [
            {
              startTime: 0,
              duration: tmpMilestone[0].startTime,
              name: '',
              timestamp: '',
            },
            ...tmpMilestone,
          ]
        }

        setDataSource(tmpDataSource)
        const tmpTotalAll = tmpMilestone[tmpMilestone.length - 1].startTime
          + tmpMilestone[tmpMilestone.length - 1].duration
        if (tmpTotalAll < TOTAL_ALL) {
          setMilestoneC([
            ...tmpMilestone,
            {
              startTime: tmpTotalAll,
              duration: TOTAL_ALL - tmpTotalAll,
              name: '',
              timestamp: '',
            },
          ])
        } else {
          setMilestoneC(tmpMilestone)
        }
        const tableContent = document.querySelector('.ant-table-body')
        tableContent.addEventListener('scroll', () => {
          refArcher.current.refreshScreen()
        })
      } catch (error) {
        // ignored
      }
    }

    fetchData()
  }, [])

  const columns = [
    {
      title: 'テンプレートタスク',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      render: (name, record) => (
        <Tooltip placement="topLeft" title={name}>
          <a href={`/template-tasks/${record.id}`}>{name}</a>
        </Tooltip>
      ),
    },
    {
      title: 'カテゴリ',
      dataIndex: 'categoryIds',
      key: 'categoryIds',
      fixed: 'left',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (categories) => {
        const tmp = categories.map((category) => category.name)
        return (
          <Tooltip placement="topLeft" title={tmp.join(',')}>
            {tmp.join(',')}
          </Tooltip>
        )
      },
    },
    {
      title: '工数',
      dataIndex: 'effort',
      key: 'effort',
      fixed: 'left',
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (effort) => (
        <Tooltip placement="topLeft" title={effort}>
          {effort}
        </Tooltip>
      ),
    },
    {
      title: 'マイルストーン',
      children: milestoneC.map((milestone) => {
        const tmp = Array.from(
          { length: milestone.duration },
          (_, i) => i + milestone.startTime,
        )
        return {
          title: (
            <Tooltip
              placement="topLeft"
              title={`${milestone.name} - ${
                milestone.timestamp ? milestone.timestamp : '0日後'
              }`}
            >
              <Typography.Text ellipsis style={{ width: `${tmp.length * 40}` }}>
                {milestone.name}
              </Typography.Text>
            </Tooltip>
          ),
          children: tmp.map((item) => ({
            title: `${item === 0 ? '開始日' : item}`,
            dataIndex: '',
            key: `day_${item}`,
            width: 60,
            render: (text, record) => {
              const obj = {
                children: '',
                props: {
                  colSpan: 1,
                  style: { borderBottom: 'none' },
                },
              }
              const baseItem = item
              if (baseItem === record.startTime) {
                const relations = record.afterTask.map((i) => ({
                  targetId: `task_${i}`,
                  targetAnchor: 'left',
                  sourceAnchor: 'right',
                  style: { strokeWidth: 2 },
                }))
                obj.props.colSpan = record.endTime - record.startTime + 1
                obj.props.style = {
                  ...obj.props.style,
                  padding: '5px 0px 5px 0px',
                }
                const firstCategoryId = record.categoryIds[0].id
                obj.children = (
                  <Tooltip
                    overlayStyle={{ maxWidth: '500px' }}
                    title={(
                      <div>
                        <p>
                          <b>テンプレートタスク:</b>
                          {` ${record.name}`}
                        </p>
                        <p>
                          <b>カテゴリ:</b>
                          {` ${record.categoryIds
                            .map((category) => category.name)
                            .join(',')}`}
                        </p>
                        <p>
                          <b>工数:</b>
                          {` ${record.effort}`}
                        </p>
                        <p>
                          <b>日程:</b>
                          {` ${record.startTime}日後 〜 ${record.endTime}日後`}
                        </p>
                      </div>
                    )}
                  >
                    <div>
                      <ArcherElement
                        id={`task_${record.id}`}
                        relations={relations}
                      >
                        <div
                          className="schedule_details_task"
                          style={{
                            backgroundColor: `${
                              firstCategoryId > colors.length - 1
                                ? 'black'
                                : colors[firstCategoryId]
                            }`,
                          }}
                        />
                      </ArcherElement>
                    </div>
                  </Tooltip>
                )
              } else if (item > record.startTime && item <= record.endTime) {
                obj.props.colSpan = 0
              }
              return obj
            },
          })),
        }
      }),
    },
  ]
  return (
    <div className="schedule-gantt mx-auto">
      <ArcherContainer strokeColor="red" lineStyle="angle" ref={refArcher}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          scroll={{ y: 550 }}
          pagination={false}
          size="small"
          components={vt}
        />
      </ArcherContainer>
    </div>
  )
}
ScheduleGantt.propTypes = {
  id: PropTypes.string.isRequired,
}
export default ScheduleGantt
