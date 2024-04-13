const express = require('express');
const router = express.Router();
const NurseModel = require('../models/Nurse');
const PatientModel = require('../models/Patient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

router.post('/login/nurse', async (req, res) => {
    // Nurse login logic
    const { email, password } = req.body;

    try {
        const nurse = await NurseModel.findOne({ email });

        if (!nurse) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare hashed password from database with hashed password provided during login
        const isPasswordMatch = await bcrypt.compare(password, nurse.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If login successful
        const token = generateToken(nurse);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
        res.status(200).json({ message: 'Nurse login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint for patient login
router.post('/login/patient', async (req, res) => {
    // Patient login logic
    const { email, password } = req.body;

    try {
        const patient = await PatientModel.findOne({ email });

        if (!patient) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the provided password matches the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, patient.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If login successful
        const token = generateToken(patient);
        res.status(200).json({ message: 'Patient login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
