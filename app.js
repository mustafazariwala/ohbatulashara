const express = require("express");
// const compression = require('compression')
const bodyParser = require("body-parser");
// const cors = require('cors')
const path = require('path');
const mongoose = require("mongoose");
require('dotenv').config()

const userRoutes = require('./routes/users')
const subscriptionRoutes = require('./routes/subscribers')


const app = express();
// app.use(cors())
// app.use(compression())

mongoose
  .connect(
    process.env.DB_NAME,
    { useNewUrlParser: true , useUnifiedTopology: true}
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Database Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/assets/images", express.static(path.join(__dirname, "images")))
app.use("/assets/media", express.static(path.join(__dirname, "files/audio")))
app.use("/", express.static(path.join(__dirname, "angular")))



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "*"
  );
  next();
});

// app.use("/api/posts",postRoutes)
app.use("/api/users",userRoutes);
app.use("/api/subscription",subscriptionRoutes);
// app.use((req,res,next)=> {
//   res.sendFile(path.join(__dirname ,"angular", "index.html"))
// })
app.use('/*',function(req, res) {
  res.sendFile(__dirname + '/angular/index.html');
});

module.exports = app;

// New Commit 