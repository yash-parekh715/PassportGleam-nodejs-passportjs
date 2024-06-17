const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create a user schema
const UserSchema = new Schema({
  username: String,
  googleID: String,
  thumbnail: String
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
