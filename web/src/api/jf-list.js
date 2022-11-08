import axios from './axios'

export const getJFList = () => axios.get('/jobfair')
export const deleteJF = (id) => axios.delete(`/jobfair/${id}`)
