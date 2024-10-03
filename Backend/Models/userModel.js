const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  Repository: [
    {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      default: [],
    },
  ],
  followedUser: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  starRepo: [
    {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      default: [],
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
