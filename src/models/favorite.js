const mongoose = require("mongoose")

const Favorite = mongoose.model("Favorite", {
  userId: mongoose.Schema.Types.ObjectId,
  listingId: String,
})

module.exports = { Favorite }
