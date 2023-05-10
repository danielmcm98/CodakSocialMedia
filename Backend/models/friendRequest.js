const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const friendRequestSchema = new Schema({
  requester: { type: ObjectId, ref: "User", required: true },
  recipient: { type: ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    required: true,
  },
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

module.exports = { FriendRequest, friendRequestSchema };
