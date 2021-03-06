const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
//this one line creates the export "User" from the first parameter, meaning that the collection will automatically be the lowercase, plural "users" and then assigns the export to the above defined userSchema. This can be done as two separate commands as we have done before at times, but this is an effective way to combine the two.