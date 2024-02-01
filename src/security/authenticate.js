const { AuthenticationError } = require("apollo-server")
const parseBearerToken = require("../utils/parse-bearer-token")

const authenticate = async function ({ req, userAPI }) {
  // Attempt to get the user token from the headers
  const token = parseBearerToken(req)

  // Token is required
  if (!token) {
    const error = new Error("missing token")
    error.statusCode = 401
    return error
  }

  // Try to retrieve a user with the token
  const user = await userAPI.getUserByToken(token)
  if (!user) {
    const error = new Error("no matching user")
    error.statusCode = 401
    return error
  }

  return user._id
}

module.exports = { authenticate }
