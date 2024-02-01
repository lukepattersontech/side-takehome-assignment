const { getConfig } = require("./src/config")
const { createServer, stopServer, startServer } = require("./src/server")
const { User } = require("./src/models/user")
const { Favorite } = require("./src/models/favorite")

let testServer
let seededUsers

const propertyAPIConfig = {
  url: getConfig("PROPERTY_API_URL"),
  username: getConfig("PROPERTY_API_USERNAME"),
  password: getConfig("PROPERTY_API_PASSWORD"),
}

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
  return res
}

beforeAll(async () => {
  testServer = await createServer()
  await startServer()
  seededUsers = await seedUsers()
})

afterAll(async () => {
  await stopServer()
})

describe("favorites", () => {
  beforeEach(async () => {
    // empty favorites before each test
    await Favorite.deleteMany({})
  })

  it("incriments favorite counter by one for a single user", async () => {
    const testUser = seededUsers[0]

    // override the context
    testServer.context = () => {
      return {
        propertyAPIURL: propertyAPIConfig.url,
        propertyAPIToken: btoa(
          `${propertyAPIConfig.username}:${propertyAPIConfig.password}`
        ),
        currentUserId: testUser._id,
      }
    }

    // get the first property
    const queryResult = await testServer.executeOperation({
      query: `
        query {
          GetProperties: properties {
            favoriteCount
            listingId
          }
        }
      `,
    })
    const firstProperty = queryResult.data.GetProperties[0]
    expect(firstProperty.favoriteCount).toEqual(0)

    // Update counter
    await testServer.executeOperation({
      query: `
      mutation AddFavorite($listingId: String) {
        addFavorite(listingId: $listingId) {
          listingId
          userId
        }
      }
      `,
      variables: { listingId: firstProperty.listingId },
    })

    // get the property again
    const updatedQueryResult = await testServer.executeOperation({
      query: `
        query {
          GetProperties: properties {
            favoriteCount
            listingId
          }
        }
      `,
    })
    const updatedFirstProperty = updatedQueryResult.data.GetProperties.find(
      (property) => property.listingId === firstProperty.listingId
    )
    expect(updatedFirstProperty.favoriteCount).toEqual(1)
  })
  it("does not incriment favorite counter more than once for a single user", async () => {
    const testUser = seededUsers[0]

    // override the context
    testServer.context = () => {
      return {
        propertyAPIURL: propertyAPIConfig.url,
        propertyAPIToken: btoa(
          `${propertyAPIConfig.username}:${propertyAPIConfig.password}`
        ),
        currentUserId: testUser._id,
      }
    }

    // get the first property
    const queryResult = await testServer.executeOperation({
      query: `
        query {
          GetProperties: properties {
            favoriteCount
            listingId
          }
        }
      `,
    })
    const firstProperty = queryResult.data.GetProperties[0]
    expect(firstProperty.favoriteCount).toEqual(0)

    // Update counter twice
    for (let i = 0; i < 2; i++) {
      await testServer.executeOperation({
        query: `
      mutation AddFavorite($listingId: String) {
        addFavorite(listingId: $listingId) {
          listingId
          userId
        }
      }
      `,
        variables: { listingId: firstProperty.listingId },
      })
    }

    // get the property again
    const updatedQueryResult = await testServer.executeOperation({
      query: `
        query {
          GetProperties: properties {
            favoriteCount
            listingId
          }
        }
      `,
    })
    const updatedFirstProperty = updatedQueryResult.data.GetProperties.find(
      (property) => property.listingId === firstProperty.listingId
    )
    expect(updatedFirstProperty.favoriteCount).toEqual(1)
  })
})

describe("properties", () => {
  it("returns a list of properties", async () => {
    const testUser = seededUsers[0]
    testServer.context = () => {
      return {
        propertyAPIURL: propertyAPIConfig.url,
        propertyAPIToken: btoa(
          `${propertyAPIConfig.username}:${propertyAPIConfig.password}`
        ),
        currentUserId: testUser._id,
      }
    }
    const response = await testServer.executeOperation({
      query: `
        query {
          GetProperties: properties {
            listingId
          }
        }
      `,
    })
    expect(response.data.GetProperties.length).toBeGreaterThan(1)
    expect(response).toHaveProperty(
      "data.GetProperties",
      expect.arrayContaining([expect.anything()])
    )
  })
  describe("city filtering", () => {
    it("returns only listings with a matching city", async () => {
      const testUser = seededUsers[0]
      testServer.context = () => {
        return {
          propertyAPIURL: propertyAPIConfig.url,
          propertyAPIToken: btoa(
            `${propertyAPIConfig.username}:${propertyAPIConfig.password}`
          ),
          currentUserId: testUser._id,
        }
      }
      const response = await testServer.executeOperation({
        query: `
        query {
          GetProperties: properties(city: "Katy") {
            address {
              city
            }
          }
        }
      `,
      })
      expect(response).toHaveProperty(
        "data.GetProperties",
        expect.arrayContaining([expect.anything()])
      )
      response.data.GetProperties.map((property) => {
        expect(property.address.city).toEqual("Katy")
      })
    })
  })
})
