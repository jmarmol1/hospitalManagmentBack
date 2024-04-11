const express = require('express');
const router = express.Router();
const NurseModel = require('../models/Nurse');
const PatientModel = require('../models/Patient');

// Endpoint for nurse registration
router.post('/register/nurse', async (req, res) => {
    const { firstName, lastName, password, email } = req.body;

    try {
        const nurse = new NurseModel({
            firstName,
            lastName,
            password,
            email
        });
        await nurse.save();
        res.status(201).json({ message: 'Nurse registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint for patient registration
router.post('/register/patient', async (req, res) => {
    const { firstName, lastName, password, email } = req.body;

    try {
        const patient = new PatientModel({
            firstName,
            lastName,
            password,
            email
        });
        await patient.save();
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/login/nurse', async (req, res) => {
    const { email, password } = req.body;

    try {
        const nurse = await NurseModel.findOne({ email });

        if (!nurse || nurse.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If login successful
        res.status(200).json({ message: 'Nurse login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Endpoint for patient login
router.post('/login/patient', async (req, res) => {
    const { email, password } = req.body;

    try {
        const patient = await PatientModel.findOne({ email });

        if (!patient || patient.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If login successful
        res.status(200).json({ message: 'Patient login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
