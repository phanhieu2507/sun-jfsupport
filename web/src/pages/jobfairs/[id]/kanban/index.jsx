import React, { useEffect, useState, useContext, useRef } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Modal, Input } from 'antd'
// import { LoadingOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ReactReduxContext } from 'react-redux'
import JfLayout from '../../../../layouts/layout-task'
import 'antd/dist/antd.css'
import './style.scss'
import { getTaskByJfId, updateTask } from '../../../../api/task-kanban'
import { getRoleTask } from '../../../../api/task-detail'
import Loading from '../../../../components/loading'

const singleTask = (type, taskIds) => {
  const obj = {}
  obj[type] = {
    id: type,
    title: type,
    taskIds,
  }
  return obj
}

const columnTask = (type, data) => {
  const taskIds = data.filter((el) => el.status === type).map((el) => el.id)
  return singleTask(type, taskIds)
}

const Column = dynamic(() => import('../../../../components/kanban/Column'))

function KanBan() {
  const router = useRouter()
  const idJf = router.query.id
  const isInitialMount = useRef(true)

  const [isLoading, setIsLoading] = useState(false)
  // const [loadingFirst, setLoadingFirst] = useState(true)
  const [task, setTask] = useState([])
  const [backupData, setBackupData] = useState([])
  const [visible, setVisible] = useState(false)
  const [memo, setMemo] = useState('')
  const [id, setId] = useState('')

  const { store } = useContext(ReactReduxContext)

  const currentUserId = store.getState().get('auth').get('user').get('id')

  // const getJf = async () => {
  //   try {
  //     const { data } = await getJobfair(idJf * 1, currentUserId)
  //   } catch (error) {
  //     if (error.response.status === 404) {
  //       router.push('/404')
  //     }
  //   }
  //   // if (data.length > 0) {
  //   //   setIsControllable(true)
  //   // }
  // }

  const fetchData = async () => {
    try {
      setIsLoading(true)
      let { data } = await getTaskByJfId(idJf)
      const jobfairName = data[0].jobfairName

      // Auto update task's status when end_time expired
      /// //////////////////////////////////////

      data.forEach(async (el) => {
        const { id: taskId, end_time: endTime, status } = el
        if (
          Date.now() > new Date(endTime).getTime()
          && (status === '進行中' || status === '中断' || status === '未着手')
        ) {
          isInitialMount.current = !isInitialMount.current
          await updateTask(taskId, { status: '未完了' })
        }
      })

      // Format data
      /// ///////////
      const columnType = []
      data = Object.values(
        data.reduce((acc, cur) => {
          acc[cur.taskName] = acc[cur.taskName] || {
            ...cur,
            userName: [],
            avatar: [],
            userId: [],
          }
          acc[cur.taskName].userName = acc[cur.taskName].userName.concat(
            Array.isArray(cur.userName) ? cur.userName : [cur.userName],
          )
          acc[cur.taskName].avatar = acc[cur.taskName].avatar.concat(
            Array.isArray(cur.avatar) ? cur.avatar : [cur.avatar],
          )
          acc[cur.taskName].userId = acc[cur.taskName].userId.concat(
            Array.isArray(cur.userId) ? cur.userId : [cur.userId],
          )
          return acc
        }, {}),
      )

      data = data.map((el) => {
        const { avatar, userName, userId } = el
        const user = userName.map((uName, uId) => ({
          uName,
          avatar: avatar[uId],
          userId: userId[uId],
        }))
        return { ...el, user }
      })

      data.forEach((el) => {
        columnType.push(el.status)
      })
      const columnOrder = ['未着手', '進行中', '完了', '中断', '未完了']
      const tasks = data.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.id]: cur,
        }),
        {},
      )

      const newColumn = columnTask('未着手', data)
      const inProgressColumn = columnTask('進行中', data)
      const doneColumn = columnTask('完了', data)
      const pendingColumn = columnTask('中断', data)
      const breakColumn = columnTask('未完了', data)
      setTask({
        jobfairName,
        tasks: {
          ...tasks,
        },
        columns: {
          ...newColumn,
          ...inProgressColumn,
          ...doneColumn,
          ...pendingColumn,
          ...breakColumn,
        },
        columnOrder,
      })
      setBackupData({
        tasks: {
          ...tasks,
        },
        columns: {
          ...newColumn,
          ...inProgressColumn,
          ...doneColumn,
          ...pendingColumn,
          ...breakColumn,
        },
        columnOrder,
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    // if (
    //   !destination
    //   || source.droppableId === '未完了'
    //   || source.droppableId === '未着手'
    //   || source.droppableId === '完了'
    //   || destination.droppableId === '完了'
    //   || destination.droppableId === '未着手'
    //   || destination.droppableId === '未完了'
    // ) {
    //   return
    // }

    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      return
    }
    const start = task.columns[source.droppableId]
    const finish = task.columns[destination.droppableId]
    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    let taskID = -1
    finishTaskIds.forEach((taskId) => {
      if (typeof taskId === 'string') {
        taskID = taskId
      }
    })

    // const isAssignee = await checkAssignee(taskID, currentUserId).catch((error) => {
    //   if (error.response.status === 404) {
    //     router.push('/404')
    //   }
    // })
    const roleTask = await getRoleTask(idJf, currentUserId, taskID).catch((error) => {
      if (error.response.status === 404) {
        router.push('/404')
      }
    })
    if (roleTask.data !== 'jfadmin' && roleTask.data !== 'reviewer' && roleTask.data !== 'taskMember') {
      return
    }
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      const newState = {
        ...task,
        columns: {
          ...task.columns,
          [newColumn.id]: newColumn,
        },
      }

      setTask(newState)
      return
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds)

    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    if (destination.droppableId === '中断') {
      finishTaskIds.forEach((taskId) => {
        if (typeof taskId === 'string') {
          setId(taskId * 1)
          Object.values(task.tasks).forEach((el) => {
            if (el.id === +taskId) {
              setMemo(el.memo)
            }
          })
        }
      })

      setVisible(true)
    }
    if (source.droppableId === '中断') {
      finishTaskIds.forEach((taskId) => {
        if (typeof taskId === 'string') {
          updateTask(taskId, { memo: null })
          fetchData()
        }
      })
    }
    if (destination.droppableId !== '中断') {
      finishTaskIds.forEach(async (taskId) => {
        if (typeof taskId === 'string') {
          try {
            await updateTask(taskId * 1, { status: destination.droppableId })
            await fetchData()
          } catch (error) {
            if (error.response.status === 404) {
              router.push('/404')
            }
          }
        }
      })
    }

    const newState = {
      ...task,
      columns: {
        ...task.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }
    setTask(newState)
  }
  const resolved = async () => {
    try {
      await updateTask(id, { memo, status: '中断' })
      await fetchData()
      setMemo('')
      setId('')
      setVisible(false)
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }

  const rejected = () => {
    setVisible(false)
    setTask(backupData)
  }

  useEffect(() => {
    localStorage.setItem('id-jf', idJf)
    // getJf()
    fetchData()
  }, [isInitialMount.current])

  // const antIcon = <LoadingOutlined style={{ fontSize: 120 }} spin />

  return (
    <div className="container__kanban">
      {isLoading && <Loading loading={isLoading} overlay={isLoading} />}
      <JfLayout style={{ padding: '0px' }} id={idJf} bgr={4}>
        <JfLayout.Main>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <h1>
              {task.jobfairName}
              {' '}
              (カンバン)
            </h1>
            <DragDropContext
              onDragEnd={onDragEnd}
              // style={{ height: '100vh' }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                {task?.columnOrder?.map((columnId) => {
                  const column = task.columns[columnId]
                  const tasks = column.taskIds.map(
                    (taskId) => task.tasks[taskId],
                  )
                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={tasks}
                      idJf={idJf}
                      // style={{ height: '100vh' }}
                    />
                  )
                })}
              </div>
            </DragDropContext>
            <Modal
              centered="true"
              title="理由を入力する"
              visible={visible}
              onOk={resolved}
              onCancel={rejected}
              okText="保存"
              cancelText="キャンセル"
            >
              <Input
                placeholder="メモ"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </Modal>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
KanBan.middleware = ['auth:superadmin', 'auth:member']
export default KanBan
