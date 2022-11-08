import axios from './axios'

const getListSchedule = () => axios.get('/schedule')

const searchListSchedule = (params) => axios.get('/search', { params })

const getGanttChart = (id) => axios.get(`/schedule/${id}/gantt`)
export const ListScheduleApi = {
  getListSchedule,
  searchListSchedule,
  getGanttChart,
}
