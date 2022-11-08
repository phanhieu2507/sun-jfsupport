/* eslint-disable no-new-object */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import { Button, Card, notification } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { postData, putData } from '../../api/jf-schedule'
import { updateParent } from '../../api/template-advance'
import Otherlayout from '../../layouts/OtherLayout'
import Tree from '../components-advance/tree'
import Loading from '../loading'
import './style.scss'
import useTree from './useTree'
/* eslint-disable-next-line react/prop-types */
const TemplateTaskAdvance = ({ dataAdvSetting, setIsAdvSettingTab, dataSendSchedule, editing }) => {
  const router = useRouter()
  // const idSchedule = router.query.id
  const {
    SampleData,
    idMilestoneActive,
    setIdMileStoneActive,
    setSamleData,
    dataChartMilestone,
    setDataChartMilestone,
    dayMilestone,
    loading,
  } = useTree(dataAdvSetting)
  const [idTaskInvalid, setIdTaskInvalid] = useState(null)
  const [changedTaskIds, setChangedTaskIds] = useState([])
  const onChangeTime = (value) => {
    setIdTaskInvalid(null)
  }
  const cancelConfirmModle = () => {
    setIsAdvSettingTab(false)
  }
  const saveNotification = () => {
    if (editing) {
      notification.success({
        message: '変更は正常に保存されました。',
        duration: 3,
        onClick: () => {},
      })
    } else {
      notification.success({
        message: '正常に登録されました。',
        duration: 3,
        onClick: () => {},
      })
    }
  }
  const handleError = (error) => {
    if (error.response.status === 422) {
      if (error.response.data.msg === 'invalid duration') {
        setIdTaskInvalid(error.response.data.template_task_id)
        notification.error({
          message: error.response.data.msg,
          duration: 3,
          onClick: () => {},
        })
      }
      if (error.response.data.msg === 'you must specify duration of all template task in a milestone') {
        setIdTaskInvalid(error.response.data.missing_template_task_id)
        notification.error({
          message: error.response.data.msg,
          duration: 3,
          onClick: () => {},
        })
      }
      if (error.response.data.msg === 'invalid start time') {
        setIdTaskInvalid(error.response.data.missing_template_task_id)
        notification.error({
          message: '後のタスクは前のタスクが終わってから始まるようにタスクの時間を調整してください。',
          duration: 3,
          onClick: () => {},
        })
      }
    }
  }
  const handSubmit = async () => {
    try {
      const task = []
      for (let index = 0; index < SampleData.length; index += 1) {
        for (let item = 0; item < SampleData[index].task.length; item += 1) {
          task.push(SampleData[index].task[item])
        }
      }
      const parent = []
      const task2 = task
      for (let index = 0; index < task.length; index += 1) {
        if (task[index].droppable) {
          const idTaskChil = []
          for (let item = 0; item < task2.length; item += 1) {
            if (task[index].id === task2[item].parent) {
              idTaskChil.push(task2[item].id)
              parent.push({ name: task[index].text, children: idTaskChil })
            }
          }
        }
      }
      // data chart
      const reTimeChart = dataChartMilestone.map((item) => ({
        milestone_id: item.milestone_id,
        template_tasks: Object.assign({}, ...item.template_tasks),
      }))
      const reParen = parent.filter(
        (value, index, self) => index === self.findIndex((t) => t.name === value.name),
      )
      const data = {
        // schedule_id: idSchedule,
        parent: reParen,
        milestones: reTimeChart,
      }
      if (editing) {
        const temp = /[/](\d+)[/]/.exec(window.location.pathname)
        const id = `${temp[1]}`
        const timeSheetEdit = dataChartMilestone.map((item) => {
          let tmpTT = {}
          item.template_tasks.map((key) => {
            const tempID = parseInt(Object.keys(key)[0], 10)
            if (!changedTaskIds.includes(tempID)) {
              tmpTT = { ...tmpTT, [tempID]: [key[tempID][0], key[tempID][1] - key[tempID][0]] }
            } else {
              tmpTT = { ...tmpTT, ...key }
            }
            return key
          })
          return {
            milestone_id: item.milestone_id,
            template_tasks: tmpTT,
          }
        })
        const dataEdit = {
          parent: reParen,
          milestones: timeSheetEdit,
        }
        await putData(id, {
          schedule: dataSendSchedule,
          merge_tasks: dataEdit,
        }).then((response) => {
          if (response.status === 200) {
            router.push(`/schedules/${id}`)
            saveNotification()
          }
        })
          .catch((error) => {
            handleError(error)
          })
      } else {
        await postData({
          schedule: dataSendSchedule,
          merge_tasks: data,
        }).then((response) => {
          if (response.status === 200) {
            router.push(`/schedules/${response.data.id}`)
            saveNotification()
          }
        })
          .catch((error) => {
            handleError(error)
          })
      }
      // await updateParent(data)
      //   .then((response) => {
      //     if (response.status === 200) {
      //       // router.push(`/schedule/${idSchedule}`)
      //       saveNotification()
      //     }
      //   })
      //   .catch((error) => {
      //     if (error.response.status === 422) {
      //       if (error.response.data.msg === 'invalid duration') {
      //         setIdTaskInvalid(error.response.data.template_task_id)
      //         notification.error({
      //           message: 'invalid duration',
      //           duration: 3,
      //           onClick: () => {},
      //         })
      //       }
      //       if (error.response.data.msg === 'you must specify duration of all template task in a milestone') {
      //         setIdTaskInvalid(error.response.data.missing_template_task_id)
      //         notification.error({
      //           message: 'you must specify duration of all template task in a milestone',
      //           duration: 3,
      //           onClick: () => {},
      //         })
      //       }
      //       if (error.response.data.msg === 'invalid start time') {
      //         setIdTaskInvalid(error.response.data.missing_template_task_id)
      //         notification.error({
      //           message: 'you must specify duration of all template task in a milestone',
      //           duration: 3,
      //           onClick: () => {},
      //         })
      //       }
      //     }
      //   })
    } catch (error) {
      if (error.response.status === 404) {
        router.push('/404')
      }
    }
  }
  return (
    <>
      <Otherlayout>
        <Otherlayout.Main>
          <h1 className="title">詳細設定</h1>
          {loading ? (
            <div className="flex flex-wrap">
              <Loading loading={loading} overlay={loading} />
            </div>
          ) : (
            <div className="m-4 item-center advance">
              <div style={{ width: '100%' }} className="item">
                <Card
                  bordered={false}
                  style={{
                    width: '100%',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                  }}
                  className="status__global"
                >
                  <div>
                    <Tree
                      // idSchedule={idSchedule}
                      onChangeTime={onChangeTime}
                      SampleData={SampleData}
                      setSamleData={setSamleData}
                      idMilestoneActive={idMilestoneActive}
                      setIdMileStoneActive={setIdMileStoneActive}
                      dayMilestone={dayMilestone}
                      dataChartMilestone={dataChartMilestone}
                      setDataChartMilestone={setDataChartMilestone}
                      idTaskInvalid={idTaskInvalid}
                      setIdTaskInvalid={setIdTaskInvalid}
                      dataAdvSetting={dataAdvSetting}
                      setChangedTaskIds={setChangedTaskIds}
                      changedTaskIds={changedTaskIds}
                    />
                  </div>
                </Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} className="group-button mt-4">
                  <Button
                    htmlType="button"
                    type="primary"
                    onClick={cancelConfirmModle}
                    className="button_cacel mr-3"
                  >
                    戻る
                  </Button>
                  <Button type="primary" className="" onClick={handSubmit}>
                    <span>
                      {editing ? '保存' : '登録'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Otherlayout.Main>
      </Otherlayout>
    </>
  )
}
// templateTaskAdvance.middleware = ['auth:superadmin']
export default TemplateTaskAdvance
