import axios from './axios'

export const checkRole = (taskId, userId) => axios.post('/task/check-role', { taskId, userId })
export const editTask = (id, argument) => axios.put(`/task/${id}`, argument)
export const getCategorys = () => axios.get('/category-jobfair')
export const reviewers = (id) => axios.get(`/task/${id}/reviewers`)
export const listReviewersSelectTag = (id) => axios.get(`/task/${id}/list-reviewers`)
export const listTaskBeforeAndAfter = (id) => axios.get(`/list-before-and-after-tasks/${id}`)
