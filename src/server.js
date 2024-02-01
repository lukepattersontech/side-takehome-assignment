const { ApolloServer } = require("apollo-server")
const mongoose = require("mongoose")
const { readFileSync } = require("fs")
const { getConfig } = require("./config")
const { authenticate } = require("./security/authenticate")

const resolvers = require("./resolvers")
const typeDefs = readFileSync("./src/schemas/schema.graphql").toString("utf-8")

const PropertyAPI = require("./datasources/property")
const UserAPI = require("./datasources/user")
const FavoriteAPI = require("./datasources/favorite")

let server

const createServer = async () => {
  const mongoDbConfig = {
    port: getConfig("MONGO_DB_PORT"),
    ip: getConfig("MONGO_DB_IP"),
    dbName: getConfig("MONGO_DB_NAME"),
  }
  const propertyAPIConfig = {
    url: getConfig("PROPERTY_API_URL"),
    username: getConfig("PROPERTY_API_USERNAME"),
    password: getConfig("PROPERTY_API_PASSWORD"),
  }

  await mongoose.connect(
    `mongodb://${mongoDbConfig.ip}:${mongoDbConfig.port}/${mongoDbConfig.dbName}`
  )

  const { User } = require("./models/user")
  const { Favorite } = require("./models/favorite")

  // Create APIs
  const favoriteAPI = new FavoriteAPI({
    modelOrCollection: Favorite,
  })
  const userAPI = new UserAPI({
    modelOrCollection: User,
  })
  const propertyAPI = new PropertyAPI()

  // Instantiate server
  server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        propertyAPI,
        favoriteAPI,
      }
    },
    context: async ({ req }) => {
      // Authenticate the user for every request
      const userId = await authenticate({ req, userAPI })

      // Include these in the context
      return {
        propertyAPIURL: propertyAPIConfig.url,
        propertyAPIToken: btoa(
          `${propertyAPIConfig.username}:${propertyAPIConfig.password}`
        ),
        currentUserId: userId,
      }
    },
  })
  return server
}

// Start the apollo server
const startServer = async () => {
  await server.listen()
}

// Stop the apollo server
const stopServer = async () => {
  await server.stop()
}

module.exports = { createServer, stopServer, startServer }
