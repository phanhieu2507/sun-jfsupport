import instance from './axios'

export const getMember = (id) => instance.get(`/members/${id}`)
export const deleteMember = (id) => instance.delete(`/members/${id}`)
