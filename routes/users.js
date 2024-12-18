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

//Attempt login with email and password, return non-auth user info
router.get('/:email/:password', async (req, res) => {
    try {
        //find the user associated with the email
        const guy = await User.findOne({email: req.params.email});

        //check if password is a match, if so return user id as json
        if(guy.password == req.params.password){
            const sanitizedGuy = new User({
                _id: guy.id,
                name: guy.name,
                email: guy.email
            })

            res.json(sanitizedGuy);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        res.sendStatus(404);
    }
});

//Validate user
router.get('/auth/:id/:email', async (req, res) => {
    try {
        //find the user associated with the id and email
        const guy = await User.findOne({_id: req.params.id, email: req.params.email});

        //return success
        res.sendStatus(200);

    } catch(error) {
        res.sendStatus(401);
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