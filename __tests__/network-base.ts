import { ToolDb } from 'tool-db'

import ToolDbLeveldb from '../packages/leveldb-store/dist'
import ToolDbWebsockets from '../packages/websocket-network/dist'
import ToolDbWeb3 from '../packages/web3-user/dist'

jest.setTimeout(20000)

let nodeA: ToolDb

afterAll((done) => {
  if (nodeA) {
    ;(nodeA.network as any).server.close()
  }
  setTimeout(done, 500)
})

it('A can retry connection', (done) => {
  const Alice = new ToolDb({
    server: false,
    maxRetries: 1000,
    peers: [{ host: 'localhost', port: 8001 }],
    storageName: 'test-base-client',
    storageAdapter: ToolDbLeveldb,
    networkAdapter: ToolDbWebsockets,
    userAdapter: ToolDbWeb3
  })
  Alice.anonSignIn()
  Alice.onConnect = () => {
    expect(Alice.isConnected).toBeTruthy()
    done()
  }

  setTimeout(() => {
    nodeA = new ToolDb({
      server: true,
      host: '127.0.0.1',
      port: 8001,
      storageName: 'test-base-server',
      storageAdapter: ToolDbLeveldb,
      networkAdapter: ToolDbWebsockets,
      userAdapter: ToolDbWeb3
    })
    nodeA.anonSignIn()
    expect(Alice.isConnected).toBeFalsy()
  }, 5000)
})
