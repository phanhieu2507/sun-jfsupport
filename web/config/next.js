const {
  cleanEnv, url, str,
} = require('envalid')

module.exports = cleanEnv(process.env, {
  APP_ENV: str({
    devDefault: 'local',
    desc: 'Application environment',
  }),

  APP_URL: url({
    desc: 'App URL',
  }),

  SERVER_API_URL: url({
    desc: 'API host for server-side render requests',
  }),

  BROWSER_API_URL: str({
    default: '/api',
    desc: 'API host for requests from browser',
  }),

  IMAGE_URL: url({
    desc: 'Image URL',
  }),

  SENTRY_DSN: str({
    devDefault: '',
    desc: 'Sentry DSN',
  }),

  MIX_GA_ID: str({
    desc: 'GA mix ID',
  }),
})
