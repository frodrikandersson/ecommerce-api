const express = require('express');
const router = express.Router();
const Categories = require('../models/Categories');

// GET all categories
router.get('/', async (req, res) => {
    try {
        res.json(await Categories.find());
    } catch(error) {
        res.json({message: error});
    }
});


module.exports = router;