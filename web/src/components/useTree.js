// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getNewMilestone } from '../api/template-advance'

const useHome = (idSchedule) => {
  const router = useRouter()

  const [SampleData, setSamleData] = useState(null)
  const [treeData, setTreeData] = useState(null)
  const [idMilestoneActive, setIdMileStoneActive] = useState(null)
  const [dataChartMilestone, setDataChartMilestone] = useState(null)
  const [dayMilestone, setDayMilestone] = useState([])
  const fechLeftData = async () => {
    await getNewMilestone(idSchedule)
      .then((res) => {
        const dataRes = Object.values(res.data)
        const newSamp = []
        const dayMilestones = []
        for (let index = 0; index < dataRes.length; index += 1) {
          // const element = array[index];
          dayMilestones.push(
            { id: dataRes[index].id,
              gap: dataRes[index].gap },
          )
          const newTask = {
            id: dataRes[index].id,
            milestone_name: dataRes[index].name,
            task: [],
          }
          for (let item = 0; item < dataRes[index].template_tasks.length; item += 1) {
            newTask.task.push(
              {
                id: dataRes[index].template_tasks[item].id,
                text: dataRes[index].template_tasks[item].name,
                parent: dataRes[index].template_tasks[item].parent,
                droppable: dataRes[index].template_tasks[item].is_parent,
                duration: dataRes[index].template_tasks[item].duration,
              },
            )
            newSamp.push(newTask)
          }
        }
        setDayMilestone(dayMilestones)
        const newRes = newSamp.filter((item, index) => newSamp.indexOf(item) === index)

        const milestones = []
        for (let index = 0; index < newRes.length; index += 1) {
          const templa = []
          for (let item = 0; item < newRes[index].task.length; item += 1) {
            templa.push({ [newRes[index].task[item].id]: newRes[index].task[item].duration })
            const a = {
              milestone_id: newRes[index].id,
              template_tasks: templa,
            }
            milestones.push(a)
          }
        }
        const newMilestone = milestones.filter((value, index, self) => index === self.findIndex((t) => (
          t.milestone_id === value.milestone_id
        )))
        setDataChartMilestone(newMilestone)
        setSamleData(newRes)
        setTreeData(newRes[0].task)
        setIdMileStoneActive(newRes[0].id)
      })
      .catch((error) => {
        if (error.res.status === 404) {
          router.push('/404')
        }
      })
  }
  useEffect(() => {
    fechLeftData()
  }, [])
  return {
    setSamleData,
    SampleData,
    treeData,
    setTreeData,
    idMilestoneActive,
    setIdMileStoneActive,
    dataChartMilestone,
    setDataChartMilestone,
    dayMilestone,
  }
}
export default useHome
