require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const bodyParser = require("body-parser");

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.iyaxi.mongodb.net/chatzap?retryWrites=true&w=majority`;

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", authRouter);

app.use((error, req, res, next) => {
  res.status(500).send(error);
});

mongoose
  .connect(MONGODB_URI)
  .then((res) => {
    console.log("Database Connected!");
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
