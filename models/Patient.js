const mongoose = require('mongoose')

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

const PatientModel = mongoose.model('patients', PatientSchema);

module.exports = PatientModel;