// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");


// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const campaignsRoutes = require("./routes/campaign.routes");
app.use("/api", campaignsRoutes);

/* const commentRoutes = require("./routes/comment.routes");
app.use("/api", commentRoutes); */

const donationsRoutes = require("./routes/donations.routes");
app.use("/api", donationsRoutes);

const institutionsRoutes = require("./routes/institutions.routes");
app.use("/api", institutionsRoutes);

const userRoutes = require("./routes/user.routes");
const { isAuthenticated } = require("./middleware/jwt.middleware");
app.use("/api", userRoutes);

app.get("/api/user/:id/campaign", isAuthenticated)

app.get("/api/user/:id/campaign/:id/donations", isAuthenticated)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);



// ========================== STRIPE LOGIC =============================
// here we handle the logic for stripe routes and configuration settings

// this is the logic for the stripe payment method in the server 

const { resolve} = require('path');

// this code will replace if using a different env file or config
const env = require('dotenv').config({path:'./.env'});  // use .env.test});


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01'
})

app.use(express.static(process.env.STATIC_DIR))


// this is the route where we gonna process the payment in our system.
// once we click on donate, the user we be redirected to this route and will start the payment process

// this index html in our code will be replaced by the component that will render the payment form 

app.get('/payment',(req, res)=>{

    // in this case, the index.html is the file that will load the payment in the frontend with the directory path
    const path = resolve(process.env.STATIC_DIR + '/index.html');
    res.sendFile(path);
})

// this route sends the publishable key to the frontend for making payments
app.get('/config', (req, res)=>{
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    })
})


// this route sends a post request for payment-intent to stripe
// we already have set a hook to get the payment intent in the frontend, now we create the payment intent
app.post('/create-payment-intent', async(req, res)=>{
    try{
        const paymentIntent = await stripe.paymentIntent.create({
            currency: 'eur',
            amount: 1999,
            automatic_payment_methods:{
                enabled: true
            }
        })
        res.send({clientSecret: paymentIntent.client_secret})
    }
catch (error) {
    console.log(error)
    res.send({error})
}
})
module.exports = app;
