const mongoose = require('mongoose');
const uniqueValidator  = require('mongoose-unique-validator')
const Schema = mongoose.Schema()

const user = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {

    },
    tasbeeh: [
        {
            grg: {
                type: Date
            },
            hij: {
                type: String,
            },
            count: {
                type: Number
            }
        }
    ]
})
mongoose.plugin(uniqueValidator)
 
module.exports = mongoose.model("Users", user)