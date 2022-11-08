import instance from './axios'

export const getMilestone = (id) => instance.get(`/milestones/${id}/list`)
export const getSchedule = (id) => instance.get(`/schedules/${id}`)
export const deleteSchedule = (id) => instance.delete(`/schedules/${id}`)
export const getScheduleList = (id) => instance.get(`/schedule/${id}/list`)
