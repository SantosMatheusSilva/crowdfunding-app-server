// Necessary imports:
const router = require("express").Router();
const Donations = require("../models/Donations.model");
const cors = require("cors");
const {isAuthenticated} = require("../middleware/jwt.middleware");


// Define cors
const corsOptions = {
    origin: ["http://localhost:5005"],
    optionsSuccessStatus: 200
};


// POST route to make a donation to an specific campaign <<<- STATUS = WORKING !
router.post("/campaign/:id/donations", isAuthenticated, cors(corsOptions), async (req, res, next) => {
    const { amount, /* IF THIS IS SET TO FALSE THE ROUTE WORKS */
            date,  
            donor, 
            paymentMethod, 
            comments
        } = req.body;
    try {
        const newDonation = await Donations.create({
            amount,
            date,
            donor,
            paymentMethod,
            comments
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

// GET Route to get all the donations from the DB - STATUS = NOT WORKING
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