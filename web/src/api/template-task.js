import axios from './axios'

export const templateTask = (id) => axios.get(`/template-tasks/${id}`)
export const beforeTask = (id) => axios.get(`/before-template-tasks/${id}`)
export const afterTask = (id) => axios.get(`/after-template-tasks/${id}`)
export const deleteTptt = (id) => axios.delete(`/template-tasks/${id}`)
export const getTaskList = () => axios.get('/template-tasks')
export const getCategories = () => axios.get('/categories-template-tasks')
