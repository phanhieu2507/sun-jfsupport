import instance from './axios'

export const getCategories = async () => instance.get('/category')
const getFullCategories = async () => instance.get('/categories')
export const searchCategory = async (key) => instance.get(`/category/find/${key}`)
export const getCategory = async (id) => instance.get(`category/${id}`)
export const updateCategory = async (id, argument) => instance.put(`/category/${id}`, argument)
export const addCategory = async (argument) => instance.post('/category', argument)
export const deleteCategory = async (id) => instance.delete(`category/${id}`)
export const CategoryApi = {
  getFullCategories,
}
export const checkUniqueAdd = async (name) => instance.post('/category/check-duplicate', name)
export const checkUniqueEdit = async (id, name) => instance.get(`/category/check-unique-edit/${id}/${name}`)
