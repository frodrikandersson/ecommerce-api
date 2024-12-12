const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/users', async (req, res) => {
    try {
        res.json(await User.find());
    } catch(error) {
        res.json({message: error});
    }
});

//POST user (hopefully)
router.post('/user', async (req, res) => {
    try{
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        console.log("TEST");
        console.log(req.body);
        await newUser.save();
    } catch (err){
        console.error("Couldnt save user", err);
    }
})

module.exports = router;