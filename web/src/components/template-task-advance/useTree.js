// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react'

const useHome = (dataAdvSetting) => {
  const [SampleData, setSamleData] = useState([])
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState([])
  const [idMilestoneActive, setIdMileStoneActive] = useState([])
  const [dataChartMilestone, setDataChartMilestone] = useState([])
  const [dayMilestone, setDayMilestone] = useState([])
  const fechLeftData = () => {
    setLoading(true)
    const dataRes = dataAdvSetting
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
        const ojectTime = dataRes[index].template_tasks[item].unit === 'companies' ? '企業数' : '学生数'
        const effort = `${dataRes[index].template_tasks[item].effort} ${dataRes[index].template_tasks[item].is_day ? '日' : '時間 / '} ${ojectTime}`
        newTask.task.push(
          {
            id: dataRes[index].template_tasks[item].id,
            text: dataRes[index].template_tasks[item].name,
            parent: dataRes[index].template_tasks[item].parent,
            droppable: dataRes[index].template_tasks[item].is_parent,
            duration: [dataRes[index].template_tasks[item].duration[0], dataRes[index].template_tasks[item].duration[0] + dataRes[index].template_tasks[item].duration[1]],
            category: dataRes[index].template_tasks[item].categories,
            effort,
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
    setLoading(false)
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
    loading,
  }
}
export default useHome
