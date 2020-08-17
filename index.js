require("dotenv").config();
require("./config/passport");

const express = require("express");
const db = require("./models");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");
const searchRoutes = require("./routes/search");
const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.static("./images"));
app.use(express.urlencoded({ extended: false }));
// app.use(cors());

app.use("/users", userRoutes);
app.use("/article", articleRoutes);
app.use("/search", searchRoutes);

db.sequelize.sync({ force: false, alter: false }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running", process.env.PORT);
  });
});
