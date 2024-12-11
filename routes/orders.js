const express = require('express');
const router = express.Router();
const Orders = require('../models/Orders');

// GET all orders
router.get('/', async (req, res) => {
    try {
        res.json(await Orders.find());
    } catch(error) {
        res.json({message: error});
    }
});


module.exports = router;