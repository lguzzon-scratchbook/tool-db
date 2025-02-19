
var __importDefault = (this && this.__importDefault) || ((mod) => (mod && mod.__esModule) ? mod : { "default": mod });
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../packages/tool-db/dist/index");
var index_2 = __importDefault(require("../packages/leveldb-store/dist/index"));
var index_3 = __importDefault(require("../packages/websocket-network/dist/index"));
var index_4 = __importDefault(require("../packages/web3-user/dist/index"));
var nodeA;
var nodeB;
var Alice;
var Bob;
var Chris;
nodeA = new index_1.ToolDb({
    server: true,
    host: "127.0.0.1",
    port: 9000,
    storageName: "test-node-a",
    storageAdapter: index_2.default,
    networkAdapter: index_3.default,
    userAdapter: index_4.default,
});
nodeA.onConnect = () => checkIfOk(nodeA.peerAccount.getAddress() || "");
nodeA.addServerFunction("test", (args) => {
    var a = args[0], b = args[1];
    if (typeof a !== "number" || typeof b !== "number") {
        throw new Error("Invalid arguments");
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(a + b);
        }, 1000);
    });
});
nodeB = new index_1.ToolDb({
    server: true,
    // Node A is going to be our "bootstrap" node
    peers: [{ host: "localhost", port: 9000 }],
    host: "127.0.0.1",
    port: 8000,
    storageName: "test-node-b",
    storageAdapter: index_2.default,
    networkAdapter: index_3.default,
    userAdapter: index_4.default,
});
nodeB.onConnect = () => checkIfOk(nodeB.peerAccount.getAddress() || "");
Alice = new index_1.ToolDb({
    server: false,
    peers: [{ host: "localhost", port: 9000 }],
    storageName: "test-alice",
    storageAdapter: index_2.default,
    networkAdapter: index_3.default,
    userAdapter: index_4.default,
});
Alice.onConnect = () => checkIfOk(Alice.peerAccount.getAddress() || "");
Bob = new index_1.ToolDb({
    server: false,
    peers: [{ host: "localhost", port: 8000 }],
    storageName: "test-bob",
    storageAdapter: index_2.default,
    networkAdapter: index_3.default,
    userAdapter: index_4.default,
});
Bob.onConnect = () => checkIfOk(Bob.peerAccount.getAddress() || "");
Chris = new index_1.ToolDb({
    server: false,
    peers: [{ host: "localhost", port: 9000 }],
    storageName: "test-chris",
    storageAdapter: index_2.default,
    networkAdapter: index_3.default,
    userAdapter: index_4.default,
});
Chris.onConnect = () => checkIfOk(Chris.peerAccount.getAddress() || "");
var connected = [];
var checkIfOk = (id) => {
    if (!connected.includes(id)) {
        connected.push(id);
        if (connected.length === 4) {
            console.log("\n          test-node-a: ".concat(nodeA.network.getClientAddress(), "\n          test-node-b: ").concat(nodeB.network.getClientAddress(), "\n          test-alice: ").concat(Alice.network.getClientAddress(), "\n          test-bob: ").concat(Bob.network.getClientAddress(), "\n          test-chris: ").concat(Chris.network.getClientAddress(), "\n        "));
        }
    }
};
setTimeout(() => {
    var testKey = "test-key-" + (0, index_1.textRandom)(16);
    var testValue = "Awesome value";
    Alice.putData(testKey, testValue).then((msg) => {
        expect(msg).toBeDefined();
        setTimeout(() => {
            Bob.getData(testKey).then((data) => {
                expect(data).toBe(testValue);
            });
        }, 1000);
    });
}, 500);
setTimeout(() => {
}, 5000);
