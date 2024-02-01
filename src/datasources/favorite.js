const { MongoDataSource } = require("apollo-datasource-mongodb")

class FavoriteAPI extends MongoDataSource {
  constructor(options) {
    super(options)
  }

  // Add a new favorite for the user and listing if not already existing
  async addFavorite(options) {
    const { listingId, userId } = options

    // Do nothing if already exists, otherwise add
    await this.collection.updateOne(
      {
        listingId,
        userId,
      },
      {
        $setOnInsert: { listingId, userId },
      },
      { upsert: true, new: true }
    )

    // Return the document
    const updatedDocument = await this.collection.findOne({ listingId, userId })
    return updatedDocument
  }

  // Count the favorite documents that correspond to the listing
  async countFavoritesByProperty(listingId) {
    const favoriteCount = await this.collection.countDocuments({ listingId })
    return favoriteCount
  }
}

module.exports = FavoriteAPI
