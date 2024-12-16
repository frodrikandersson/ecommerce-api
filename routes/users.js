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

//Attempt login with email and password
router.get('/:email/:password', async (req, res) => {
    try {
        //find the user associated with the email
        const guy = await User.findOne({email: req.params.email});
        //check if password is a match, if so return user id as json
        if(guy.password == req.params.password){
            res.json(guy.id);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        res.sendStatus(404);
    }
});

//POST a user to database
router.post('/add', async (req, res) => {
    try{
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.json(await newUser.save());
    } catch (error){
        res.json({message: error});
    }
})

router.checkout

module.exports = router;