import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import types from './types'

// const setLocalStorage = () => {
//   const isCollapsed = localStorage.getItem('isCollapsed')
//   if (isCollapsed) {
//     return JSON.parse(isCollapsed)
//   }
//   localStorage.setItem('isCollapsed', JSON.stringify(true))
//   return true
// }

//= ============== SELECTOR ===============//
const collapseStatus = (state) => state.getIn(['collapseReducer', 'collapseStatus'])

export const selectors = {
  collapseStatus,
}

//= ============== REDUCER ===============//
const initState = fromJS({
  collapseStatus: false,
})

const changeCollapseState = (state, action) => state.set('collapseStatus', fromJS(action.payload))

const reducer = handleActions(
  {
    [types.COLLAPSE]: changeCollapseState,
  },
  initState,
)

export default reducer
