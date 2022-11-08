import instance from './axios'

export const getCompanies = async () => instance.get('/companies')
export const searchCompany = async (key) => instance.get(`/companies/find/${key}`)
export const getCompany = async (id) => instance.get(`companies/${id}`)
export const updateCompany = async (id, argument) => instance.put(`/companies/${id}`, argument)
export const addCompany = async (argument) => instance.post('/companies', argument)
export const deleteCompany = async (id) => instance.delete(`companies/${id}`)
export const checkUniqueAdd = async (argument) => instance.post('/companies/check-duplicate', argument)
export const checkUniqueEdit = async (argument) => instance.post('/companies/check-unique-edit', argument)
