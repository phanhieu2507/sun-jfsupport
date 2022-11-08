import instance from './axios'

export const editDocument = async (id, argument) => instance.put(`file/${id}/edit`, argument)
export const getRootPathFile = async (JFid) => instance.get(`/file/${JFid}`)
export const getLatest = async (id) => instance.get(`/file/${id}/getLatest`)
export const deleteDocument = async (id, argument) => instance.post(`file/${id}/delArray`, argument)
export const getPath = async (argument) => instance.get('file/getPath', argument)
export const getMember = async () => instance.get('file/member')
export const searchFile = async (argument) => instance.get('file/find', argument)
export const addDocument = (agr) => instance.post('/file', agr)
