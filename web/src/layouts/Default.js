import React from 'react'
import PropTypes from 'prop-types'

import _get from 'lodash/get'
import { Layout } from 'antd'

import { findSlot } from '~/utils/pages'

import '~/assets/styles/less/app.less'

const DefaultLayout = ({ children }) => {
  const head = findSlot(DefaultLayout.Head, children)
  const main = findSlot(DefaultLayout.Main, children)

  return (
    <Layout className="v-layout flex bg-white-background">
      {process.env.NODE_ENV !== 'production' && (
        <link
          rel="stylesheet"
          type="text/css"
          href={`/_next/static/css/styles.chunk.css?v=${Date.now()}`}
        />
      )}
      {_get(head, 'props.children')}

      <Layout.Content className="v-layout-content flex-shrink-0">
        {_get(main, 'props.children')}
      </Layout.Content>
    </Layout>
  )
}

DefaultLayout.Head = () => null
DefaultLayout.Main = () => null
DefaultLayout.Header = () => null

DefaultLayout.defaultProps = {
  children: [],
}

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
}

export default DefaultLayout
