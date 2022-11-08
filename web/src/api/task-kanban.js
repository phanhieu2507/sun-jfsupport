import instance from './axios'

export const getTaskByJfId = (id) => instance.get(`/kanban/${id}`)
export const getJobfair = (id, userId) => instance.get(`/kanban/${id}/${userId}`)
export const updateTask = (id, arg) => instance.put(`/kanban/updateTask/${id}`, arg)
