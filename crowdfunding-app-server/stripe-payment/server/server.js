// this is the logic for the stripe payment method in the server 

const express = require('express');
const app = express();
const { resolve} = require('path');

// this code will replac if using a different env file or config
const env = require('dotenv').config({path:'./.env'});  // use .env.test});


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01'
})

app.use(express.static(process.env.STATIC_DIR))


// this is the route where we gonna process the payment in our system.
// once we click on donate, the user we be redirected to this rout and will start the payment process
// this index html inn our code will be replaced by the component that will render the payment form 

app.get('/',(req, res)=>{

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

app.listen(5252, ()=>
{
console.log('Server listening on port 5252 at http://localhost:5252');
})

/**
 * 
 * 
STATIC_DIR = '../{CLIENT_ROOT}'

STRIPE_PUBLISHABLE_KEY = 'pk_test_51OtpgbP1YStE7BhyQDxXl6kWDwKizV1r0V7klQc9wDHE2QnfjFfeTM3SaJ72X6kWpw6J4OeYdsHT51Fl767pNKDz00uKH7J6A7'
STRIPE_SECRET_KEY = 'sk_test_51OtpgbP1YStE7BhyKtg7IAdwojWQkzRWaYGnEtMGW9pGcCffFeP3Rld0AIAzpBG8YzknYbldf0m9UU5Sd2G5pbMe00mvqWiIJK'

 * 
 */