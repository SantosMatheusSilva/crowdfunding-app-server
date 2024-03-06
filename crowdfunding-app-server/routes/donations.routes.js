// Necessary imports:
const router = require("express").Router();
const Donations = require("../models/Donations.model");
const cors = require("cors");


// Define cors
const corsOptions = {
    origin: ["http://localhost:5005"],
    optionsSuccessStatus: 200
};


// POST route to make a donation to an specific campaign <<<- ROUTE NOT WORKING !
router.post("/donations/campaign/:id", cors(corsOptions), async (req, res, next) => {
    const { amout, 
            date,  
            donor, 
            paymentMethod, 
            Comments
        } = req.body;
    try {
        const newDonation = await Donations.create({
            amout,
            date,
            donor,
            paymentMethod,
            Comments
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

// GET Route to get all the donations from the DB 
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

// GET Route to get all the donations from the DB by campaign 
router.get("/donations/campaign/:id", cors(corsOptions), async (req, res, next) => {
    try {
        const { id } = req.params;
        const donations = await Donations.find({campaign: id});
        if(!donations){
            throw new Error ("error found");
        }
        res.json(donations);
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;