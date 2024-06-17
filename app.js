const express = require("express");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
require("dotenv").config();
// const cookieSession = require("cookie-session");
const passport = require("passport");
const session = require("express-session");

const app = express();

//set up a view engine
app.set("view engine", "ejs");

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //cookie object mein maxAge nhi dala to code fatega as wo cookie save nhi krega browser mein aur user undefined ho jayega
  })
);

// app.use(
//   cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [keys.session.cookieKey],
//   })
// ); ye use nhi krna hai as express-session is better and this one is deprecated probably

//initialise cookies
app.use(passport.initialize());
app.use(passport.session());

//connect to mongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((e) => {
    console.log(e);
  });

//setup routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

//home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
