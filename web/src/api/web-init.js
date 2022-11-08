import instance from './axios'

export const webInit = () => instance.get('/web-init')
