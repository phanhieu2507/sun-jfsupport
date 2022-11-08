import React from 'react'
import { fromJS } from 'immutable'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'
import { Router, withRouter } from 'next/router'
import App from 'next/app'
import NProgress from 'nprogress'
import { ConfigProvider } from 'antd'
import * as Sentry from '@sentry/browser'

import jaJP from 'antd/lib/locale/ja_JP'
import Head from 'next/head'

import axios from '~/api/axios'
import createStore from '~/store'
import { usePromise } from '~/utils/store'
import Middleware from '~/modules/middleware'
import { LOAD as INIT_AUTH_USER } from '~/store/modules/auth'

import 'antd/dist/antd.css'
import 'tailwindcss/tailwind.css'
import 'nprogress/nprogress.css'
import './global.scss'
import 'react-quill/dist/quill.snow.css'

Sentry.init({ dsn: `${process.env.SENTRY_DSN}` })

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => {
  window.scrollTo(0, 0)
  NProgress.done()
})
Router.events.on('routeChangeError', () => NProgress.done())

if (process.env.NODE_ENV !== 'production') {
  Router.events.on('routeChangeComplete', () => {
    const path = '/_next/static/css/styles.chunk.css'
    const chunksSelector = `link[href*="${path}"]`
    const chunksNodes = document.querySelectorAll(chunksSelector)
    const timestamp = new Date().valueOf()
    chunksNodes[0].href = `${path}?${timestamp}`
  })
}

const serverURL = process.env.SERVER_API_URL
class Jobfair extends App {
  static async getInitialProps({ Component, ctx }) {
    if (ctx.isServer) {
      axios.defaults.headers.common.cookie = ctx.req.headers.cookie || ''
      ctx.serverURL = serverURL
      await usePromise(ctx.store.dispatch, {
        type: INIT_AUTH_USER,
        payload: { res: ctx.res },
      })
    }

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}

    const middleware = new Middleware(ctx)
    await middleware.validate(Component)

    return { ...pageProps }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key])
      })

      Sentry.captureException(error)
    })

    super.componentDidCatch(error, errorInfo)
  }

  render() {
    const { Component, pageProps, store } = this.props

    return (
      <Provider store={store}>
        <Head>
          <title>JF Support</title>
          {/* <link rel="shortcut icon" href="favicon.svg" /> */}
        </Head>
        <ConfigProvider prefixCls="ant" locale={jaJP}>
          <Component {...pageProps} />
        </ConfigProvider>
      </Provider>
    )
  }
}

export default withRouter(
  withRedux(createStore, {
    serializeState: (state) => state,
    deserializeState: (state) => fromJS(state),
  })(withReduxSaga(Jobfair)),
)
