const { RESTDataSource } = require("apollo-datasource-rest")
const { getConfig } = require("../config")

class PropertyAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = getConfig("PROPERTY_API_URL")
  }

  // Get properties from the API with optional city filter param
  async getProperties(city) {
    const params = city ? { cities: [city] } : undefined

    return await this.get("properties", params)
  }

  // Add basic auth token to every API request
  willSendRequest(request) {
    request.headers.set(
      "Authorization",
      "Basic " + this.context.propertyAPIToken
    )
  }
}

module.exports = PropertyAPI
