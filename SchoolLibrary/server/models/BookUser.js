const mongoose = require('mongoose');

let bookUserSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    bookId: {type: mongoose.Schema.Types.ObjectId, ref: 'Book'},
    getDate: {type: mongoose.Schema.Types.Date, default: Date.now},
    returnDate: {type: mongoose.Schema.Types.Date, required: "Return date is required"},
    isReturned: {type: mongoose.Schema.Types.Boolean, default: false}
})

let BookUser = mongoose.model('BookUser', bookUserSchema);

module.exports = BookUser;