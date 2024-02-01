var passport = require("passport");
var User = require("../models/user");
var LocalStrategy = require("passport-local").Strategy;
var { body, validationResult } = require("express-validator");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        await Promise.all([
          body("email", "Invalid email").notEmpty().isEmail().run(req),
          body("password", "Invalid password")
            .notEmpty()
            .isLength({ min: 4 })
            .run(req),
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const messages = errors.array().map((error) => error.msg);
          return done(null, false, req.flash("error", messages));
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          return done(null, false, { message: "Email is already in use." });
        }

        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        await Promise.all([
          body("email", "Invalid email").notEmpty().isEmail().run(req),
          body("password", "Invalid password")
            .notEmpty()
            .isLength({ min: 4 })
            .run(req),
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const messages = errors.array().map((error) => error.msg);
          return done(null, false, req.flash("error", messages));
        }

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
          return done(null, false, { message: "User not found." });
        }

        if (!existingUser.validPassword(password)) {
          return done(null, false, {
            message: "Password doesn't match given email.",
          });
        }
        return done(null, existingUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);
