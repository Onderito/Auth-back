const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");

require("./db");

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
