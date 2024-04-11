const express = require('express');
const router = express.Router();
const NurseModel = require('../models/Nurse');
const PatientModel = require('../models/Patient');
const jwt = require('jsonwebtoken');


function generateToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token)
    {
       jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=> {
          if(err)
          {
             console.log(err.message)
             res.redirect('/login')
          }
          else
          {
             console.log(decodedToken)
             next()
          }
 
       })
 
    }
    else{
       console.log("token undefined")
       res.redirect('/login')
    }
 }


// Endpoint for user registration
router.post('/register', async (req, res) => {
    const { firstName, lastName, password, email, userType } = req.body;

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

        // Using create function to directly create and save the user
        const user = await UserModel.create({
            firstName,
            lastName,
            password,
            email
        });
        
        // If registration successful, generate JWT token
        const token = generateToken(user);
        
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3*24*60*60*1000})
        res.status(201).json({ message: 'User registered successfully', token });
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
        const token = generateToken(nurse);
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3*24*60*60*1000})
        res.status(200).json({ message: 'Nurse login successful',token});
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
        const token = generateToken(patient);
        res.status(200).json({ message: 'Patient login successful',token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
