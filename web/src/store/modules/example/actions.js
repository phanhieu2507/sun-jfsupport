import { put, call, takeLatest } from 'redux-saga/effects'
import { createAction } from 'redux-actions'

import types from './types'

//= ============== ACTIONS ===============//
const load = createAction(types.LOAD_EXAMPLES)
const loadSuccess = createAction(types.LOAD_EXAMPLES_SUCCESS)
const loadFail = createAction(types.LOAD_EXAMPLES_FAIL)
const storeData = createAction(types.STORE_EXAMPLES)
const storePaginate = createAction(types.STORE_PAGINATE)

export const actions = {
  load,
}

//= =============== SAGAS ===============//
export function* sagas() {
  yield takeLatest(types.LOAD_EXAMPLES, fetchData)
}

function* fetchData({ payload }) {
  try {
    const exampleApi = {
      fetch: 1,
    }
    const { data: response } = yield call(exampleApi.fetch, payload)
    const { data, meta } = response
    yield put(storeData(data))
    yield put(storePaginate(meta))
    yield put(loadSuccess())
  } catch (error) {
    yield put(loadFail())
  }
}
