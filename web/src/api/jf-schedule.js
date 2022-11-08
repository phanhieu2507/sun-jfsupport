import instance from './axios'

export const getSchedule = (id) => instance.get(`/schedules/${id}`)
export const getMilestonesList = () => instance.get('/jf-schedules/all-milestones/')
export const getTemplateTaskList = () => instance.get('/jf-schedules/all-template-tasks/')
export const getAddedMilestonesList = (id) => instance.get(`/schedules/${id}/added-milestones/`)
export const getAddedTemplateTaskList = (id) => instance.get(`/schedules/${id}/added-template-tasks/`)
export const putData = (id, argument) => instance.put(`/schedules/${id}/`, argument)
export const postData = (argument) => instance.post('/schedules/', argument)
export const postCheckExistName = (argument) => instance.post('/jf-schedules/checkScheduleNameExist', argument)
