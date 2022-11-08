import instance from '~/api/axios'

export const login = (credentials) => instance.post('/login', credentials)
export const sendLinkResetPassword = (email) => instance.post('/reset-password', { email })
export const updatePassword = (data) => instance.post('/update-password', data)
export const logout = () => instance.post('/logout')
export const preURL = async (url) => instance.get('/preURL', { params: { preURL: url } })
export const getPreURL = async () => instance.get('/getPreURL')
