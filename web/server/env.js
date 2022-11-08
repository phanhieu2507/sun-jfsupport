import { cleanEnv, url, host, port, str } from 'envalid'

const env = cleanEnv(process.env, {
  APP_KEY: str({
    desc: 'The encryption key',
  }),

  HOST: host({
    desc: 'Listening host for web app in server',
    default: '0.0.0.0',
  }),

  PORT: port({
    desc: 'Listening port for web app in server',
    default: 3000,
  }),

  SERVER_API_URL: url({
    desc: 'API host for server-side render requests',
    devDefault: 'http://nginx',
  }),

  SENTRY_DSN: str({
    devDefault: '',
    desc: 'Sentry DSN',
  }),

  REDIS_HOST: host({
    default: '127.0.0.1',
    desc: 'Redis host',
  }),

  REDIS_PORT: port({
    default: 6379,
    desc: 'Redis port',
  }),

  REDIS_PASSWORD: str({
    default: '',
    desc: 'Redis password',
  }),
})

export const {
  APP_KEY,
  HOST,
  PORT,
  SERVER_API_URL,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  SENTRY_DSN,
} = env
