const mongoose = require('mongoose')

const NurseSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String,
    email: String
});

const NurseModel = mongoose.model('nurses', NurseSchema);

module.exports = NurseModel;