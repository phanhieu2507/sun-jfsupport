import instance from '~/api/axios'

const getMemberDetail = (id) => instance.get(`/member/${id}`)
const getListMember = () => instance.get('/member')
const updateMember = (id, req) => instance.patch(`/member/${id}/update`, req)

const getTasksOfMember = (id) => instance.get(`/member/${id}/tasks`)

export const MemberApi = {
  getMemberDetail,
  getListMember,
  updateMember,
  getTasksOfMember,
}
export const sendInviteLink = (data) => instance.post('/invite-member', data)
