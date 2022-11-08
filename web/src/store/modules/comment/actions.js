import { createAction } from 'redux-actions'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as commentAPI from '~/api/comment'
import types from './types'

//= ============== ACTIONS ===============//
const load = createAction(types.LOAD_COMMENT)
const loadSuccess = createAction(types.LOAD_COMMENT_SUCCESS)
const loadFail = createAction(types.LOAD_COMMENT_FAIL)
const storeData = createAction(types.STORE_COMMENTS)
const addComment = createAction(types.ADD_COMMENT)
const editComment = createAction(types.EDIT_COMMENT)
const deleteComment = createAction(types.DELETE_COMMENT)
const clearStore = createAction(types.CLEAR_STORE)
export const actions = {
  load,
  addComment,
  editComment,
  deleteComment,
  storeData,
  clearStore,
}

//= =============== SAGAS ===============//
export function* sagas() {
  yield takeLatest(types.LOAD_COMMENT, fetchData)
  yield takeLatest(types.ADD_COMMENT, updateStore)
  yield takeLatest(types.EDIT_COMMENT, updateStore)
  yield takeLatest(types.DELETE_COMMENT, updateStore)
  yield takeLatest(types.CLEAR_STORE, updateStore)
}

function* fetchData({ payload }) {
  try {
    const response = yield call(commentAPI.getComments, ...payload.params)
    const data = response.data.comments
    const comments = [...payload.commentArray, ...data].reverse()
    yield put(storeData(comments))
    yield put(loadSuccess(comments))
  } catch (error) {
    yield put(loadFail())
  }
}

function* updateStore({ payload }) {
  try {
    yield put(storeData(payload))
    yield put(loadSuccess(payload))
  } catch (error) {
    yield put(loadFail())
  }
}
