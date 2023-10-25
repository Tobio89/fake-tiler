import {createServer} from './utils/server'

createServer()
  .then(server => {
    server.listen(4444, () => {
      console.info(`Listening on http://localhost:4444`)
    })
  })
  .catch(err => {
    console.error(`Error: ${err}`)
  })