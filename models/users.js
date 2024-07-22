const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trime: true, required: true },
  password: { type: String, trim: true, required: true },
});

// Hachage du mot de passe avant l'enregistrement initial
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

userSchema.pre("updateOne", function (next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.password) {
    update.$set.password = bcrypt.hashSync(update.$set.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
