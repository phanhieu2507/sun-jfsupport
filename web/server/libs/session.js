import session from 'express-session'
import connectRedis from 'connect-redis'

import client from './redis'
import { APP_KEY } from '../env'

const RedisStore = connectRedis(session)

const store = new RedisStore({
  client,
})

const cookie = {
  maxAge: 86400000,
}

export default session({
  secret: APP_KEY,
  resave: false,
  saveUninitialized: false,
  cookie,
  store,
})
