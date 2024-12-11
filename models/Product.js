const mongoose = require('mongoose');


const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: false
    },
    stock: {
        type: Number,
        required: true
    },
    
    images: {
        type: String,
        required: false
    },
    ratings: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            required: false
        }
    }]
});

module.exports = mongoose.model('Products', ProductSchema);
