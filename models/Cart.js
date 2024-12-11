const mongoose = require('mongoose');


const CartSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
}, { collection: 'cart' });

module.exports = mongoose.model('Cart', CartSchema);
