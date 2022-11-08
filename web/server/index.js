import consola from 'consola'
import { resolve } from 'path'

import next from './next'
import createServer from './express'
import { HOST, PORT } from './env'

next.prepare().then(async () => {
  const publicDir = resolve(__dirname, '../public')
  const handleNextJSPage = next.getRequestHandler()

  // Initial Express server:
  const server = createServer({ publicDir })

  server.all('*', (req, res) => handleNextJSPage(req, res))

  // Start Express server:
  await server.listen(PORT, HOST)

  consola.success(`server is listening on http://${HOST}:${PORT}`)
})
