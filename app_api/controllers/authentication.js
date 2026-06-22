const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/users');
const { JsonWebTokenError } = require('jsonwebtoken');

passport.use(new LocalStrategy(
    {
     usernameField: "email",
     passwordField: "password"
  },
  function(email, pass, done) {
    User.findOne({ email: email })
    .then(function(u) {
       if (!u) {
          return done(null, false, { message: "User does not exist" });
       }
       if (!u.validPassword(pass)) {
          return done(null, false, { message: "Password is not valid." });
       }
       return done(null, u);
    });
  }
))

const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
        .status(400)
        .json({"message": "All fields required"});
    }
    try{
        const user = new User({
            name: req.body.name, // Set User name
            email: req.body.email, // Set e-mail address
            phone: req.body.phone,
            petName: req.body.petName,
            petType: req.body.petType,
            address: req.body.address
        });
        user.setPassword(req.body.password); 
        const savedUser = await user.save();

        if (!savedUser) {
            return res.status(400).json({message: "Error saving user."});    
        } else {
            const token = user.generateJWT();
            return res.status(200).json({ token });
        } 
    } catch (err) {
        return res.status(400).json({message: "Registration failed.", error: err});
    }
};

const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({"message": "All fields required"});
    }

    passport.authenticate('local', (err, user, info) => {
        console.log(err);
        if (err) {
            return res
                .status(900)
                .json(err);
        }

        if (user) {
            const token = user.generateJWT();
            return res 
                .status(200)
                .json({token});
        } else {
            return res
                .status(401)
                .json(info);
        }
    }) (req, res);
};

const jwt = require('jsonwebtoken');

const token_login = (req, res) => {
    if (!req.body.token) {
        return res
            .status(400)
            .json({"message": "Invalid JWT!"});
    }

    let token = req.body.token;
    return res.status(200).json(jwt.verify(token, process.env.JWT_SECRET));
}

module.exports = {
    register,
    login,
    token_login
};


