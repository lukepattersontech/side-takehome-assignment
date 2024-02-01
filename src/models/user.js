const mongoose = require("mongoose")

const User = mongoose.model("User", { email: String, token: String })

module.exports = { User }
