/* Copied from https://www.npmjs.com/package/parse-bearer-token (No CJS version) */
const parseBearerToken = function (req) {
  // Try to get auth header
  var auth = req.headers ? req.headers.authorization || null : null
  if (!auth) {
    return null
  }
  var parts = auth.split(" ")
  // Malformed header.
  if (parts.length < 2) {
    return null
  }
  var schema = parts.shift().toLowerCase()
  var token = parts.join(" ")
  // Check if schema match
  if (schema !== "bearer" && schema !== "bearer:") {
    return null
  }
  return token
}

module.exports = parseBearerToken
