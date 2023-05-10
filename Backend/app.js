const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const { routes } = require("./routes/social");

 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

 

app.use(express.static(path.join(__dirname, "public")));

 

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

 

app.use("/", routes);

 

mongoose.set("strictQuery", true);
mongoose
 // .connect("mongodb://127.0.0.1:27123/Project")
 // .connect("mongodb://127.0.0.1/Project")
  .connect("mongodb+srv://g00370587:jXofb9UppcacHwlx@social.yrx4z0q.mongodb.net/Project")
  .then((res) => {
    console.log("Connected to MongoDB");
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Mongoose connection error: " + err);
  });

 

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to db"));