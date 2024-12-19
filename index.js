// Import
require('dotenv').config();
const express = require('express')    // Import express, a light-weight framework

//const session = require('express-session'); //import express session for user login session management
//const MongoStore = require('connect-mongo');

const app = express()                 // Init express, and save it in "app" variable
const mongoose = require('mongoose'); // Import mongoose, a tool that gives NoSQL DB (such as Mongodb), the ablilities of a relational DB (such MySQL)
const corse = require('cors');
const helmet = require('helmet');

//Middleware
app.use(corse());           // Allow cross-origin requests 
app.use(helmet());          // Protection. Needs explanation
app.use(express.json());    // Formats data to Json

app.use(express.urlencoded({extended: true}));  //CAN NOW READ URL INSERTED POST WOOOOO

/*app.use(session({
    name: "EcommerceSession",
    secret: process.env.DB_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true, secure: true, partitioned: true, sameSite: 'none'},
    store: MongoStore.create(
        {
            mongoUrl: process.env.DB_URL,
            ttl: 6000,
            autoRemove: 'native'
        }
    )
}));*/

// Import and use routes
const productRouter = require('./routes/products');
app.use('/products', productRouter);
const categoriesRouter = require('./routes/categories');
app.use('/categories', categoriesRouter);
const cartRouter = require('./routes/cart');
app.use('/cart', cartRouter);
const ordersRouter = require('./routes/orders');
app.use('/orders', ordersRouter);

const userRouter = require('./routes/users');
app.use('/users', userRouter);

// Connect to your own DB
mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {console.log('DB connected')}
)

// Listen to server
app.listen(process.env.PORT || 5000); //Listen through port 5000