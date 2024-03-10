// Necessary imports:
const router = require("express").Router();
const Donations = require("../models/Donations.model");
const cors = require("cors");
const {isAuthenticated} = require("../middleware/jwt.middleware");
const Campaign = require("../models/Campaign.model");
const User = require("../models/User.model");

// Define cors
const corsOptions = {
    origin: ["http://localhost:5005"],
    optionsSuccessStatus: 200
};


// POST route to make a donation to an specific campaign <<<- STATUS = WORKING !
router.post("user/:id/campaign/:id/donations", isAuthenticated, cors(corsOptions), async (req, res, next) => {
   const { id } = req.params;

    try {
    const { amount, /* IF THIS IS SET TO FALSE THE ROUTE WORKS */
            date,  
            donor, 
            paymentMethod, 
            comments
        } = req.body;
        const newDonation = await Donations.create({
            amount,
            date,
            donor,
            paymentMethod,
            comments
        });
        await Campaign.findByIdAndUpdate(id, {
            $push: {donations: newDonation}
        }).populate("donations");

        await User.findByIdAndUpdate(donor, {
            $push: {donations: newDonation}
        })
        if(!newDonation) {
            throw new Error ("error found");
        }
        res.json(newDonation);
    }
    catch (error) {
        next(error);
    }
} )


// GET Route to get all the donations from the DB - STATUS = WORKING - but dont retun the campaign id:
router.get("/donations", cors(corsOptions), async (req, res, next) => {
    try {
        const donations = await Donations.find();
        if(!donations){
            throw new Error("error found");
        }
        res.json(donations);
        }
        catch(error) {
            next(error);
        }
});

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