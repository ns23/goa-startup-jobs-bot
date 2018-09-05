const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: Number,
        required: true,
        unique: true
    },
    user_name: {
        type: String
    }
})

const User = mongoose.model('user', userSchema);
module.exports = User;