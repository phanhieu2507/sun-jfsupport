import axios from './axios'

export const updateTemplateTask = (id, argument) => axios.put(`/template-tasks/${id}`, argument)

export const getTemplateTask = (id) => axios.get(`/template-tasks/${id}`)
export const getCategoryData = () => axios.get('/categories-template-tasks')
export const getMilestoneData = () => axios.get('/milestone')
export const getPrevTasks = (id) => axios.get(`/before-template-tasks/${id}`)
export const getNextTasks = (id) => axios.get(`/after-template-tasks/${id}`)
export const getTemplateTasksList = () => axios.get('/template-tasks')
export const getBeforeAndAfterTemplateTask = (id) => axios.get(`/list-before-and-after-template-tasks/${id}`)
