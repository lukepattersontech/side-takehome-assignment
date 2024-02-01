const { MongoMemoryServer } = require("mongodb-memory-server")
const mongoose = require("mongoose")
const { getConfig, setConfig } = require("../src/config")

const mongoDbConfig = {
  dbName: getConfig("MONGO_DB_NAME"),
}

let mongod

beforeAll(async () => {
  // Create mongodb server in memory for running our tests
  mongod = await MongoMemoryServer.create({
    instance: mongoDbConfig,
  })

  // Update our config with the actual mongo details (chooses open port)
  const { ip, port, dbName } = mongod.instanceInfo
  setConfig("MONGO_DB_IP", ip)
  setConfig("MONGO_DB_PORT", port)
  setConfig("MONGO_DB_NAME", dbName)
})

afterAll(async () => {
  // Wind down mongo server and mongoose
  await mongoose.disconnect()
  await mongod.stop()
})
