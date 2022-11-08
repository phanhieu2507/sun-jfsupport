import instance from './axios'

const editApi = {
  jfdata: (id) => {
    const url = `/jobfair/${id}`
    return instance.get(url)
  },
  ifSchedule: (id) => {
    const url = `/jf-schedule/${id}`
    return instance.get(url)
  },
  editJF: (id) => {
    const url = `/jobfair/${id}`
    return instance.put(url, 'aaaa')
  },
  getSchedule: () => {
    const url = '/schedules'
    return instance.get(url)
  },

  getTemplateTaskList: (id) => {
    const url = `/schedules/${id}/template-tasks`
    // const url = `/jobfair/${id}/tasks`

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
  isJFExisted: (name) => {
    const url = '/is-jf-existed/'
    return instance.post(url, name)
  },
  getAll: (requests) => instance.all(requests),
  getSchedulesTaskByName: (name) => {
    const url = `/schedule/search?name=${name}`
    return instance.get(url)
  },
}
export default editApi
