const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
require("dotenv").config();
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for the google strategy
      callbackURL: "/auth/google/redirect",
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user already exists
      User.findOne({ googleID: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log("Current User is : ", currentUser);
          done(null, currentUser);
        } else {
          //if not create user in our DB
          new User({
            username: profile.displayName,
            googleID: profile.id,
          })
            .save()
            .then((newUser) => {
              console.log(`new user created: ${newUser}`);
              done(null, newUser);
            });
        }
      });
    }
  )
);
