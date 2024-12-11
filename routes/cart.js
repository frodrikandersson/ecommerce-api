const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET all cart
router.get('/', async (req, res) => {
    try {
        res.json(await Cart.find());
    } catch(error) {
        res.json({message: error});
    }
});


module.exports = router;