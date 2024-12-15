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

//Get one user by ID
router.get('/:id', async (req, res) => {
    try {
        res.json(await User.find(req.params.id));
    } catch(error) {
        res.json({message: error});
    }
});

//POST a user
router.post('/', async (req, res) => {
    try{
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.json(await newUser.save());
    } catch (err){
        res.json({message: err});
    }
})

module.exports = router;