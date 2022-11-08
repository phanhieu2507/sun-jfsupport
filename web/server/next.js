import { resolve } from 'path'
import createNext from 'next'

const dev = process.env.NODE_ENV !== 'production'
const dir = resolve(__dirname, '../src')

export default createNext({ dev, dir })
