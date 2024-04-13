const express = require('express');
const router = express.Router();


router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
