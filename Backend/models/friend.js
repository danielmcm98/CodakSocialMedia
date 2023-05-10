const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const friendSchema = new Schema({
  user1: { type: ObjectId, ref: "User", required: true },
  user2: { type: ObjectId, ref: "User", required: true },
});

const Friend = mongoose.model("Friend", friendSchema);

module.exports = { Friend, friendSchema };
