const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
 
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    phoneNumber: String, // Add phone number field
    confirmPassword: String // Add confirm password field
});
 
userSchema.plugin(passportLocalMongoose);
 
module.exports = mongoose.model('User', userSchema);