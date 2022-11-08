import instance from '~/api/axios'

export const sendInviteLink = (data) => instance.post('/invite-member', data)
