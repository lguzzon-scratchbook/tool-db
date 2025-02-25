import { ToolDb, textRandom } from '../packages/tool-db/dist/index'
import ToolDbLeveldb from '../packages/leveldb-store/dist/index'
import ToolDbWebsockets from '../packages/websocket-network/dist/index'
import ToolDbWeb3 from '../packages/web3-user/dist/index'

let nodeA: ToolDb
let nodeB: ToolDb
let Alice: ToolDb
let Bob: ToolDb
let Chris: ToolDb

nodeA = new ToolDb({
  server: true,
  host: '127.0.0.1',
  port: 9000,
  storageName: 'test-node-a',
  storageAdapter: ToolDbLeveldb,
  networkAdapter: ToolDbWebsockets,
  userAdapter: ToolDbWeb3
})
nodeA.onConnect = () => checkIfOk(nodeA.peerAccount.getAddress() || '')

nodeA.addServerFunction<number, number[]>('test', (args) => {
  const [a, b] = args

  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Invalid arguments')
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve((a as any) + (b as any))
    }, 1000)
  })
})

nodeB = new ToolDb({
  server: true,
  // Node A is going to be our "bootstrap" node
  peers: [{ host: 'localhost', port: 9000 }],
  host: '127.0.0.1',
  port: 8000,
  storageName: 'test-node-b',
  storageAdapter: ToolDbLeveldb,
  networkAdapter: ToolDbWebsockets,
  userAdapter: ToolDbWeb3
})
nodeB.onConnect = () => checkIfOk(nodeB.peerAccount.getAddress() || '')

Alice = new ToolDb({
  server: false,
  peers: [{ host: 'localhost', port: 9000 }],
  storageName: 'test-alice',
  storageAdapter: ToolDbLeveldb,
  networkAdapter: ToolDbWebsockets,
  userAdapter: ToolDbWeb3
})
Alice.onConnect = () => checkIfOk(Alice.peerAccount.getAddress() || '')

Bob = new ToolDb({
  server: false,
  peers: [{ host: 'localhost', port: 8000 }],
  storageName: 'test-bob',
  storageAdapter: ToolDbLeveldb,
  networkAdapter: ToolDbWebsockets,
  userAdapter: ToolDbWeb3
})
Bob.onConnect = () => checkIfOk(Bob.peerAccount.getAddress() || '')

Chris = new ToolDb({
  server: false,
  peers: [{ host: 'localhost', port: 9000 }],
  storageName: 'test-chris',
  storageAdapter: ToolDbLeveldb,
  networkAdapter: ToolDbWebsockets,
  userAdapter: ToolDbWeb3
})
Chris.onConnect = () => checkIfOk(Chris.peerAccount.getAddress() || '')

const connected: string[] = []
const checkIfOk = (id: string) => {
  if (!connected.includes(id)) {
    connected.push(id)

    if (connected.length === 4) {
      console.log(`
          test-node-a: ${nodeA.network.getClientAddress()}
          test-node-b: ${nodeB.network.getClientAddress()}
          test-alice: ${Alice.network.getClientAddress()}
          test-bob: ${Bob.network.getClientAddress()}
          test-chris: ${Chris.network.getClientAddress()}
        `)
    }
  }
}

setTimeout(() => {
  const testKey = `test-key-${textRandom(16)}`
  const testValue = 'Awesome value'

  Alice.putData(testKey, testValue).then((msg) => {
    expect(msg).toBeDefined()

    setTimeout(() => {
      Bob.getData(testKey).then((data) => {
        expect(data).toBe(testValue)
      })
    }, 1000)
  })
}, 500)

setTimeout(() => {}, 5000)
