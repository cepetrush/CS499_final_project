const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { constants } = require('perf_hooks');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    petName: {
        type: String,
        required: false
    },
    petType: {
        type: String,
        required: false
    },
    hash: String,
    salt: String
});

// Method to set the password on this record
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Method to compare entered password against stored has
userSchema.methods.validPassword = function(password){
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

// Method to genterate a JSON Web Token for the current record
userSchema.methods.generateJWT = function() {
    //const expiry = new Date();
    //expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        // Payload for our JSON Web Token
        _id: this._id,
        email: this.email,
        name: this.name,
        //exp: parseInt(expiry.getTime() / 1000, 10),
    }, process.env.JWT_SECRET, // SECRET stored in .env file
        {expiresIn: '30d'}); // Token expires an hour from creation
};

const User = mongoose.model('users', userSchema);
module.exports = User;
//mongoose.model('users', userSchema);