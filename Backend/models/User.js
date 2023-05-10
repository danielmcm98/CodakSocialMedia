const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  userEmail: { type: String, required: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }],
  expoPushToken: { type: String, required: true },
  profilePicture: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

});


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hash = await bcrypt.hash(this.password, 12);
      this.password = hash;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };
