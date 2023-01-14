import Gun from 'gun'
import { createServer as createHttpServer } from 'http'
import { createServer as createHttpsServer } from 'https'
import { readFileSync } from 'fs'

const portEnv = process.env.OPENSHIFT_NODEJS_PORT ?? process.env.VCAP_APP_PORT ?? process.env.PORT ?? process.argv[2]
const port = (portEnv && parseInt(portEnv)) ?? 8765
const peers = process.env.PEERS?.split(';') ?? []
const keyEnv = process.env.HTTPS_KEY
const certEnv = process.env.HTTPS_CERT

function createServer() {
  if (keyEnv && certEnv) {
    return createHttpsServer({
      key: readFileSync(keyEnv),
      cert: readFileSync(certEnv)
    })
  } else {
    return createHttpServer()
  }
}

Gun({ web: createServer().listen(port), peers, radisk: false })
