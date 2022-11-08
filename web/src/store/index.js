import { fromJS } from 'immutable'
import { applyMiddleware, createStore, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

const bindMiddleware = (middleware) => {
  const composeEnhancers = process.env.APP_ENV !== 'production'
        && typeof window === 'object'
        && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

  return composeEnhancers(
    applyMiddleware(...middleware),
  )
}

function configureStore(initialState = fromJS({})) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer,
    initialState,
    bindMiddleware([sagaMiddleware]),
  )

  store.sagaTask = sagaMiddleware.run(rootSaga)

  return store
}

export default configureStore
