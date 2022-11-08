import instance from './axios'

export const updateInfo = (id, arg) => instance.put(`/profile/${id}/update_info`, arg)

export const updateAvatar = (id, arg) => instance.post(`/profile/${id}/update_avatar`, arg)

export const getAllProfile = () => instance.get('/profile')

export const updatePassword = (id, arg) => instance.post(`/profile/${id}/update_password`, arg)

export const getProfile = (id) => instance.get(`/profile/${id}`)
export const getAvatar = (id) => instance.get(`/avatar/${id}`)
