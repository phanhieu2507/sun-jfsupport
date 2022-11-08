/* eslint-disable camelcase */
import instance from './axios'

export const updateMilestone = (id, argument) => instance.put(`/milestone/${id}`, argument)

export const getMilestone = (id) => instance.get(`/milestone/${id}`)

export const getNameExitEdit = (id, name, period, is_week) => instance.get(`/check-unique-edit/${id}/${name}/${period}/${is_week}`)

export const getNameExitAdd = (name, period, is_week) => instance.get(`/check-unique-add/${name}/${period}/${is_week}`)

export const addMilestone = (argument) => instance.post('milestone/', argument)

export const checkMilestoneNameExisted = (name) => instance.post('/milestone/check-name-existed', name)

export const getAllMileStone = () => instance.get('/milestone')

export const deleteMileStone = (id) => instance.delete(`/milestone/${id}`)
