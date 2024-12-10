const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
    try {
        res.json(await User.find());
    } catch(error) {
        res.json({message: error});
    }
});

module.exports = router;