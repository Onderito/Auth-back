const mongoose = require("mongoose");

// my mongodb connection
const MONGO_URI = "mongodb://localhost:27017/onderito";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true, // it's a new version of mongodb
    useUnifiedTopology: true, // it's for mongodb v5.0+
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
