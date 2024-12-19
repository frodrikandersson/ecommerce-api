const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');
//const session = require('express-session');

// GET all users
router.get('/', async (req, res) => {
    try {
        res.json(await User.find());
    } catch(error) {
        res.json({message: error});
    }
});

//Login validation and session creation
router.post('/login', async (req, res) => {
    try {
        //find the user associated with the email
        const guy = await User.findOne({email: req.body.email}).lean();

        //check if password is a match, if so return sanitized user for storage
        if(guy.password == req.body.password){
           const userSession = new Session({
                session: [guy._id, guy.first_name + " " + guy.last_name, guy.email]
            })

            await userSession.save();

            res.json(userSession._id);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        console.log("big error");
        res.sendStatus(404);
    }
});

//logs the user out by destroying the session
router.post('/logout', async (req, res) => {
    try {
        await Session.deleteOne({_id: req.body.session});

        res.sendStatus(200);
    } catch(error){
        res.sendStatus(500);
    }
});

router.post('/authenticate', async (req, res) => {
    try {
        const userSession = await Session.findOne({_id: req.body.session});

        res.json(userSession);
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