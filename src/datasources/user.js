const { MongoDataSource } = require("apollo-datasource-mongodb")

class UserAPI extends MongoDataSource {
  constructor(options) {
    super(options)
  }

  // Fetch the user by token
  async getUserByToken(token) {
    const user = await this.collection.findOne({ token })
    return user
  }
}

module.exports = UserAPI
