const resolvers = {
  Query: {
    properties: async (_, { city }, { dataSources }) => {
      // Fetch properties from API, with optional city filter param
      const properties = await dataSources.propertyAPI.getProperties(city)

      // For each property, fetch any corresponding favorites and update favoriteCount prop
      return properties.map(async (property) => {
        property.favoriteCount =
          await dataSources.favoriteAPI.countFavoritesByProperty(
            property.listingId
          )
        return property
      })
    },
  },
  Mutation: {
    addFavorite: async (_, { listingId }, { currentUserId, dataSources }) => {
      // Create a new favorite
      const favorite = await dataSources.favoriteAPI.addFavorite({
        listingId,
        userId: currentUserId,
      })

      return favorite
    },
  },
}

module.exports = resolvers
