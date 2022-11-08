import instance from './axios'

const addJFAPI = {
  getSchedule: () => {
    const url = '/schedules'
    return instance.get(url)
  },

  getTaskList: (id) => {
    const url = `/schedules/${id}/template-tasks`
    return instance.get(url)
  },
  getMilestone: (id) => {
    const url = `/schedules/${id}/milestones`
    return instance.get(url)
  },
  getAdmin: () => {
    const url = '/category-member'
    return instance.get(url, { params: { category: 'Xseeds管理者' } })
  },
  getCompany: () => {
    const url = '/companies'
    return instance.get(url)
  },
  addJF: (data) => {
    const url = '/jobfair'
    return instance.post(url, data)
  },
  isJFExisted: (name) => {
    const url = '/is-jf-existed/'
    return instance.post(url, name)
  },
  multiRequest: (requests) => instance.all(requests),
}
export default addJFAPI
