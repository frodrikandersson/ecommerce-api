const mongoose = require('mongoose');

//might not need
//const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
});

//might not need
//const User = mongoose.model('User', UserSchema);

module.exports = mongoose.model('User', UserSchema);