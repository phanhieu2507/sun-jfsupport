import instance from './axios'

const addTemplateTaskAPI = {
  getMilestones: () => {
    const url = '/milestone'

    return instance.get(url)
  },
  getJobfair: (id) => {
    const url = `/jobfair/${id}`
    return instance.get(url)
  },
  getCategories: () => {
    const url = '/categories-template-tasks'
    return instance.get(url)
  },
  getAllTemplateTasksNotAdded: (id) => {
    const url = `/template-task-not-added/${id}`
    return instance.get(url)
  },
  addTasks: (id, data) => {
    const url = `/jobfair/${id}/add-task`
    return instance.post(url, data)
  },
//   isTemplateTaskExisted: (data) => {
//     const url = '/is-template-task-existed'
//     return instance.post(url, data)
//   },
}
export default addTemplateTaskAPI
