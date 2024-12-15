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
        //check if password is a match, if so write cookie and redirect to page the request originated from
        if(guy.password == req.params.password){
            res.cookie("LoginCookieEcommerce", guy.id);
            res.redirect(req.protocol + "://" + req.headers.host);
        } else {
            res.json("Login fail")
        }
    } catch(error) {
        res.json({message: error});
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
        await newUser.save();
        res.redirect(req.protocol + "://" + req.headers.host);
    } catch (error){
        res.json({message: error});
    }
})

router.checkout

module.exports = router;