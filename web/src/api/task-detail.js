import axios from './axios'

export const taskData = (id) => axios.get(`/task/${id}`)
export const beforeTask = (id) => axios.get(`/before-tasks/${id}`)
export const afterTask = (id) => axios.get(`/after-tasks/${id}`)
export const deleteTask = (id) => axios.delete(`/task/${id}`)
export const getUser = () => axios.get('/users')
export const getUserByCategory = (category) => axios.get('/category-member', { params: { category } })
export const checkAssignee = (taskID, userID) => axios.get(`/isAssignee/${taskID}/${userID}`)
export const updateManagerTask = (id, arg) => axios.put(`/updatemanager/${id}`, arg)
export const getTaskReviewer = (id) => axios.get(`/task/${id}/reviewers`)
export const getListReviewers = (id) => axios.get(`/task/${id}/list-reviewers`)
export const getRoleTask = (jobfairId, userId, taskId) => axios.get(`/task-role/${jobfairId}/${userId}/${taskId}`)
export const updateStatusMember = (userId, taskId, status) => axios.put(`/update-status/${userId}/${taskId}?status=${status}`)
