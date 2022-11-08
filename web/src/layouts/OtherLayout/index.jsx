import React from 'react'
import { Layout } from 'antd'
import './style.scss'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import { findSlot } from '../../utils/pages'
import Navbar from '../../components/navbar'
import '../../pages/global.scss'

const { Content } = Layout
const Otherlayout = ({ children }) => {
  const main = findSlot(Otherlayout.Main, children)
  return (
    <div className="otherlayout">
      <Layout>
        <Layout className="site-layout">
          <Navbar />
          <Content
            style={{
              margin: '20px 16px 20px 16px',
              padding: 24,
              minHeight: 280,
              backgroud: '#fff',
            }}
          >
            {_get(main, 'props.children')}
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}
export default Otherlayout
Otherlayout.Main = () => null
Otherlayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}
Otherlayout.defaultProps = {
  children: [],
}
