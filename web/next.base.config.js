import _assign from 'lodash/assign'
import { resolve } from 'path'
import { EnvironmentPlugin, ContextReplacementPlugin } from 'webpack'
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin'
import {
  APP_ENV,
  APP_URL,
  SERVER_API_URL,
  BROWSER_API_URL,
  IMAGE_URL,
  SENTRY_DSN,
  MIX_GA_ID,
} from './config/next'

const webpack = (config, { isServer }) => {
  config.plugins.push(
    new FilterWarningsPlugin({
      exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
    }),
  )

  config.plugins.push(
    new EnvironmentPlugin({
      APP_ENV,
      APP_URL,
      SERVER_API_URL,
      BROWSER_API_URL,
      IMAGE_URL,
      SENTRY_DSN,
      MIX_GA_ID,
    }),
  )

  config.plugins.push(
    new ContextReplacementPlugin(
      /@jobfair\/middleware/,
      resolve(__dirname, './src/middleware'),
      true,
      /\.js$/,
    ),
  )

  config.resolve.alias = _assign({}, config.resolve.alias, {
    '~': resolve(__dirname, 'src'),
    'assets': resolve(__dirname, 'src/assets'), // eslint-disable-line
  })

  if (isServer) {
    const antStyles = /antd\/.*?\/style.*?/
    const origExternals = [...config.externals]
    config.externals = [
      (context, request, callback) => {
        if (request.match(antStyles)) return callback()
        if (typeof origExternals[0] === 'function') {
          return origExternals[0](context, request, callback)
        }
        return callback()
      },
      ...(typeof origExternals[0] === 'function' ? [] : origExternals),
    ]

    config.module.rules.unshift({
      test: antStyles,
      use: 'null-loader',
    })

    config.module.rules.unshift({
      test: /\.js?$/,
      resolve: {
        extensions: ['.js'],
      },
    })
  }

  config.module.rules.push({
    test: /\.md$/,
    use: 'raw-loader',
  })

  return config
}

export default { webpack }
