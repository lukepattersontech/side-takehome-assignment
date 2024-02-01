/* 
For local functional / manual testing
- Runs a mongodb server in memory
- Runs a local apollo server
Note: This is not needed for running tests
*/
const { MongoMemoryServer } = require("mongodb-memory-server")
const mongoose = require("mongoose")
const { getConfig, setConfig } = require("../src/config")
const { createServer } = require("../src/server")
const { User } = require("../src/models/user")

const mongoDbConfig = {
  dbName: getConfig("MONGO_DB_NAME"),
}

;(async () => {
  console.log("Starting mongo memory server")
  const mongod = await MongoMemoryServer.create({
    instance: mongoDbConfig,
  })
  const uri = mongod.getUri()
  const { ip, port, dbName, dbPath } = mongod.instanceInfo

  // Update env vars with actual mongo details (chooses any open port)
  setConfig("MONGO_DB_IP", ip)
  setConfig("MONGO_DB_PORT", port)
  setConfig("MONGO_DB_NAME", dbName)

  console.log(`Database uri: ${uri}`)
  console.log(`Database running on port: ${port}`)
  console.log(`Database Name: ${dbName}`)
  console.log(`Local DB Storage path ${dbPath}`)

  // Connect to mongoose
  await mongoose.connect(`${uri}${dbName}`)

  // Seed our test users
  await seedUsers()

  // Create apollo server and listen on port 4000
  const server = await createServer()
  server.listen({ port: 4000 }, () =>
    console.log(`Listening on http://localhost:4000/graphql`)
  )
})()

const seedUsers = async function () {
  const res = await User.insertMany([
    {
      email: "user1@sideinc.com",
      token: "676cfd34-e706-4cce-87ca-97f947c43bd4",
    },
    {
      email: "user2@sideinc.com",
      token: "2f403433-ba0b-4ce9-be02-d1cf4ad6f453",
    },
  ])
  console.log("Test user seeding complete", res)
}
