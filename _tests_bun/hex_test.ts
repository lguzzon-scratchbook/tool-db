import { hexToString, stringToArrayBuffer, arrayBufferToHex } from 'tool-db'
import { textRandom, ToolDb, MapCrdt, type VerificationData } from 'tool-db'

import ToolDbLeveldb from '../packages/leveldb-store/dist'
import ToolDbWebsockets from '../packages/websocket-network/dist'
import ToolDbWeb3 from '../packages/web3-user/dist'

import { describe, test, beforeAll, afterAll, expect } from 'bun:test'

test('Converts hex to string', () => {
  expect(hexToString('536f6d6556657279546573742d7956616c756532')).toEqual(
    'SomeVeryTest-yValue2'
  )
})

test('Converts string to hex', () => {
  expect(arrayBufferToHex(stringToArrayBuffer('SomeVeryTest-yValue2'))).toEqual(
    '536f6d6556657279546573742d7956616c756532'
  )
})
