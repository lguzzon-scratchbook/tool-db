import { textRandom, ToolDb } from "tool-db";

import ToolDbLeveldb from "../packages/leveldb-store/dist";
import ToolDbWebsockets from "../packages/websocket-network/dist";
import ToolDbWeb3 from "../packages/web3-user/dist";

let Alice: ToolDb;

beforeAll((done) => {
  Alice = new ToolDb({
    server: false,
    peers: [],
    storageName: "test-store",
    storageAdapter: ToolDbLeveldb,
    networkAdapter: ToolDbWebsockets,
    userAdapter: ToolDbWeb3,
  });
  Alice.anonSignIn();
  done();
});

afterAll((done) => {
  setTimeout(done, 500);
});

it("Can write and read inmediately", (done) => {
  setTimeout(() => {
    const testKey = "io-test-" + textRandom(16);
    const testValue = textRandom(24);

    Alice.store.put(testKey, testValue).finally(() => {
      Alice.store
        .get(testKey)
        .then((val) => {
          expect(val).toBe(testValue);
          done();
        })
        .catch(done);
    });
  }, 500);
});
