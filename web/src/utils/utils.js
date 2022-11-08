import moment from 'moment'
import * as statusConsts from '../shared/constants/taskStatus'
import * as colorConsts from '../shared/constants/taskColorByStatus'

export const formatDate = (date) => moment(date).format('YYYY/MM/DD')
export const changeDateFormat = (date) => {
  const year = date.getFullYear()
  const month = (`${date.getMonth() + 1}`).length > 1 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  const day = (`${date.getDate()}`).length > 1 ? date.getDate() : `0${date.getDate()}`
  return (
    `${year}-${month}-${day}`
  )
}
export const unique = (arr) => Array.from(new Set(arr))
export const truncate = (input, num) => (input.length > num ? `${input.substring(0, num)}...` : input)

export const generateStatusColor = (status) => {
  switch (status) {
    case statusConsts.NEW:
      return colorConsts.NEW

    case statusConsts.IN_PROGRESS:
      return colorConsts.IN_PROGRESS

    case statusConsts.DONE:
      return colorConsts.DONE

    case statusConsts.PENDING:
      return colorConsts.PENDING

    case statusConsts.BREAK:
      return colorConsts.BREAK

    default:
      return 'blue'
  }
}
