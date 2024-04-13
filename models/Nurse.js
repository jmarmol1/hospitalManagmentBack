const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const NurseSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String,
    email: String
});

NurseSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const NurseModel = mongoose.model('nurses', NurseSchema);

module.exports = NurseModel;
