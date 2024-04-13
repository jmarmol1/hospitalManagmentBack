const express = require('express');
const router = express.Router();
const NurseModel = require('../models/Nurse');
const PatientModel = require('../models/Patient');
const jwt = require('jsonwebtoken');

function generateToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}


router.post('/register', async (req, res) => {
  
    const { firstName, lastName, password, email, userType,vitalSigns,commonSigns} = req.body;

    try {
        let UserModel;
        switch (userType) {
            case 'nurse':
                UserModel = NurseModel;
                break;
            case 'patient':
                UserModel = PatientModel;
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }

       
        const user = new UserModel({
            firstName,
            lastName,
            password,
            email,
            vitalSigns,
            commonSigns
        });

        await user.save();
        
        
        const token = generateToken(user);
        
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3*24*60*60*1000})
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
