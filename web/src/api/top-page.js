import axios from 'axios'

export const tasks = () => axios.get('api/top-page/tasks')
export const taskReviewer = () => axios.get('api/top-page/task-reviewer')
export const members = () => axios.get('/api/top-page/members')
export const jobfairs = () => axios.get('/api/top-page/jobfairs')
export const taskSearch = (jobfairName) => axios.get(`api/top-page/tasks?jobfair-name=${jobfairName}`)
