const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");

const {MONGOURI} = require("./keys");

const PORT = 5000;

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose Connected");
});

mongoose.connection.on("error", (error) => {
  console.log("Error : ", error);
});
require("./models/User");
require("./models/Post");
require("./models/UserNotification");
app.use(express.json());
app.use(cors())
app.use(require("./routes/auth"));
app.use(require("./routes/post"));


app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});