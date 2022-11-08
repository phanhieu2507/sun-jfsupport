import instance from './axios'

const API = {
  getTasks: (jobfairId) => {
    const url = `/jobfair/${jobfairId}/tasks`
    return instance.get(url)
  },
  getMilestones: (jobfairId) => {
    const url = `/jobfair/${jobfairId}/milestones`
    return instance.get(url)
  },
  getJobfair: (jobfairId) => {
    const url = `/jobfair/${jobfairId}`
    return instance.get(url)
  },

  getGanttTasks: (jobfairId) => {
    const url = `/jobfair/${jobfairId}/gantt`
    return instance.get(url)
  },

  getBeforeTasks: (jobfairId) => {
    const url = `/before-tasks/${jobfairId}`
    return instance.get(url)
  },
  getAfterTasks: (jobfairId) => {
    const url = `/after-tasks/${jobfairId}`
    return instance.get(url)
  },
}
export default API
