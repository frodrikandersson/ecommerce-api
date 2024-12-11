const mongoose = require('mongoose');


const OrdersSchema = mongoose.Schema({
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
        },
        price: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        }
    }],
    total_price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    shipping_address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        }
    }
});

OrdersSchema.pre('save', function (next) {
    let total = 0;

    this.products.forEach(product => {
        total += parseFloat(product.price) * product.quantity;
    });

    this.total_price = total.toFixed(2);
    next();
});

module.exports = mongoose.model('Orders', OrdersSchema);
