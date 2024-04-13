const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PatientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String,
    email: String,
    vitalSigns: [{
        bodyTemperature: String, 
        heartRate: String,
        bloodPressure: String,
        respiratoryRate: String,
        date: Date
    }],
    commonSigns: {
        fever: Boolean,
        cough: Boolean,
        fatigue: Boolean,
        headache: Boolean,
        bodyAche:Boolean
    }
});

PatientSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const PatientModel = mongoose.model('patients', PatientSchema);

module.exports = PatientModel;
