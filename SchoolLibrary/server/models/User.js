const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')

let userSchema = new mongoose.Schema({
    username: {type: String, required: "Username is required!", unique: true},
    salt: String,
    hashedPass: String,
    firstName: {type: String, required: "First name is required!"},
    lastName: {type: String, required: "Last name is required!"},
    class: {type: Number},
    numberInClass: {type: Number},
    takenBooks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book', default: []}],
    favouriteBooks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book', default:[]}],
    readBooks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book', default:[]}],
    roles: [{type: String, default: []}]
})

userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass
    }
})

let User = mongoose.model('User', userSchema)

module.exports = User
module.exports.seedAdminUser = () => {
    User.find({}).then(users => {
        if (users.length > 0) return

        let salt = encryption.generateSalt()
        let hashedPass = encryption.generateHashedPassword(salt, 'admin')

        User.create({
            firstName: "Admin",
            lastName: "Admin",
            username: 'admin',
            salt: salt,
            hashedPass: hashedPass,
            roles: ['Admin']
        })
    })
}
