const mongoose = require('mongoose')

// plugin de validation moogoose
const uniqueValidator = require('mongoose-unique-validator')

// avec unique true pas d'inscription si adresse déjà utilisée
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)