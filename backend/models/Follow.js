const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // who follows
      required: true,
    },

    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // whom they follow
      required: true,
    },
  },
  { timestamps: true }
);

// One user can follow another only once
followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model("Follow", followSchema);
