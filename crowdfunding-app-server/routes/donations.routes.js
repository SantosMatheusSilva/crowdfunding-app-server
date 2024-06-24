// Necessary imports:
const router = require("express").Router();
const Donations = require("../models/Donations.model");
const cors = require("cors");
const {isAuthenticated} = require("../middleware/jwt.middleware");
const Campaign = require("../models/Campaign.model");
const User = require("../models/User.model");
const Institutions = require("../models/Institutions.model");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// POst route for  STRIPE payment-intent
router.post("/donations/create-payment-intent", async (req, res) => {
    // Extract amount and currency from the request body
    const { amount, currency } = req.body;
    const { userId, campaignId } = req.params;

    if (!amount || !currency) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    const paymentAmount = amount * 100;

    try {
        // Create a PaymentIntent with the specified amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: paymentAmount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        if (!paymentIntent || !paymentIntent.client_secret) {
            return res.status(400).json({ message: "Payment intent creation failed" });
        }

        // Send the client secret back to the client
        res.send({
            paymentIntent: paymentIntent.client_secret, paymentIntent,
        });
    } catch (error) {
        console.error("Error creating PaymentIntent:", error);
        res.status(500).json({ error: "Failed to create PaymentIntent" });
    }
});

// GET rout for STRIPE payment-intent
router.get("/donations/create-payment-intent", async (req, res) => {
    
})

// POST route to make a donation to an specific campaign <<<- STATUS = WORKING !
router.post("/user/:userId/campaign/:campaignId/donations", async (req, res) => {
    const { userId, campaignId } = req.params;

    try {
        const {
            amount,
            paymentMethod,
            comments,
            donationStatus,
            currency
        } = req.body;

        // Adjust payment amount to smallest currency unit (e.g., cents)
        const paymentAmount = amount * 100;

        // Create payment intent with adjusted amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: paymentAmount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Check if payment intent creation failed
        if (!paymentIntent || !paymentIntent.client_secret) {
            return res.status(400).json({ message: "Payment intent creation failed" });
        }

        // Check payment status
        const paymentResponse = await stripe.paymentIntents.retrieve(paymentIntent.id);

        if (paymentResponse.status === "succeeded") {
            // Payment succeeded, create donation
            const newDonation = await Donations.create({
                user: userId,
                amount,
                currency,
                paymentMethod,
                comments,
                donationStatus,
                campaign: campaignId,
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret
            });

            // Update campaign and user with new donation
            await Campaign.findByIdAndUpdate(campaignId, {
                $push: { donations: newDonation._id }
            });
            await User.findByIdAndUpdate(userId, {
                $push: { donations: newDonation._id }
            }).populate("donations");

            // Return client secret and new donation
            return res.json({ clientSecret: paymentIntent.client_secret, newDonation });
        } else {
            // Payment failed or is pending, handle accordingly
            return res.status(400).json({ message: "Payment failed or is pending" });
        }
    } catch (error) {
        // Handle server error
        return res.status(500).json({ message: error.message });
    }
});

/* router.post("/user/:userId/campaign/:campaignId/donations", async (req, res) => {
   const {id, userId, campaignId} = req.params;

    try {
    const { 
            amount,
            paymentMethod, 
            comments,
            donationStatus,
            currency
        } = req.body;
        console.log("req.body", req.body);

    const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
            automatic_payment_methods: {
                enabled: true,
              },
        });
    //console.log(paymentIntent.id);

    if (!paymentIntent || !paymentIntent.client_secret) {
        return res.status(400).json({message: "Payment intent failed"});
    }
    const PaymentResponse = await stripe.paymentIntents.retrieve(paymentIntent.id);
    console.log(PaymentResponse);


    if (PaymentResponse.status === "succeeded") {
    
        const newDonation = await Donations.create({
        user: userId,
        amount,
        currency,
        paymentMethod,
        comments,
        donationStatus,
        campaign: campaignId,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret
    });

    await Campaign.findByIdAndUpdate(campaignId, {
        $push: {donations: newDonation._id}
    });
    await User.findByIdAndUpdate(userId, {
        $push: {donations: newDonation._id}
    }).populate("donations");
    }

        res.json({clientSecret: paymentIntent.client_secret, newDonation});
    }
    catch (error) {
        return res.status(500).json({message: error.message});
    }
} )
 */
// POST route to make a donation to an specific institution -<<<- STATUS = WORKING
router.post("/user/:userId/institutions/:institutionId/donations", async (req, res) => {
    const {userId, institutionId, id} = req.params;
 
     try {
     const { 
             amount,
             paymentMethod, 
             comments
         } = req.body;
         const newDonation = await Donations.create({
             user: userId,
             amount,
             currency,
             paymentMethod,
             comments,
             institution: institutionId
         });
         await Donations.findById(id).populate("user");
         await Institutions.findByIdAndUpdate(institutionId, {
             $push: {donations: newDonation}
         });
 
         await User.findByIdAndUpdate(userId, {
             $push: {donations: newDonation}
         }).populate("donations");
         res.json(newDonation);
     }
     catch (error) {
         return res.status(500).json({message: error.message});
     }
 } )

// GET Route to get all the donations from the DB - STATUS = WORKING - but dont retun the campaign id:
router.get("/donations", async (req, res, next) => {
    try {
        const donations = await Donations.find()
        .populate("user")
        .populate("campaign");
        if(!donations){
            throw new Error("error found");
        }
        res.json(donations);
        }
        catch(error) {
            next(error);
        }
});

// GEt route to get a specifc donation by its ID
router.get("/donations/:donationId", async (req, res, next) => {
    try {
        const {donationId} = req.params;
        const donation = await Donations.findById(donationId)
        .populate("user")
        .populate("campaign");
        if(!donation){
            throw new Error ("error found");
        }
        res.json(donation);
    }
    catch (error) {
        next(error);
    }
})

// GET Route to get all the donations from the DB by campaign - STATUS = NOT WORKING
/* router.get("/campaigns/:id/donations", cors(corsOptions), async (req, res, next) => {
    try {
        const { id } = req.params;
        const donations = await Donations.find({campaign: id}).populate("donations");
        if(!donations){
            throw new Error ("error found");
        }
        res.json(donations);
    }
    catch (error) {
        next(error);
    }
});
 */
module.exports = router;