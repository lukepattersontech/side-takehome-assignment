require("dotenv").config()

// return the value from environment variables
function getConfig(key) {
  return process.env[key]
}

// set an environment variable (for local testing purposes only)
function setConfig(key, value) {
  process.env[key] = value
}

module.exports = { setConfig, getConfig }
