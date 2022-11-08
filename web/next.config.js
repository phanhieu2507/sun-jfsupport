import path from 'path'
import fs from 'fs'

import withPlugins from 'next-compose-plugins'
import css from '@zeit/next-css'
import sass from '@zeit/next-sass'
import less from '@zeit/next-less'
import lessToJS from 'less-vars-to-js'

import progressBar from 'next-progressbar'
import nextConfig from './next.base.config'

const lessConfig = {
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: lessToJS(
      fs.readFileSync(path.resolve(__dirname, './src/assets/styles/less/libs/antd/themes/new-theme.less'), 'utf8'),
    ),
  },
}

const cssConfig = {
  cssLoaderOptions: {
    importLoaders: 1,
    url: false,
  },
}

export default withPlugins([
  progressBar,
  sass,
  [css, cssConfig],
  [less, lessConfig],
], nextConfig)
