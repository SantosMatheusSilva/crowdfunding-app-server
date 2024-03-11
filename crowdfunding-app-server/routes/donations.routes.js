// Necessary imports:
const router = require("express").Router();
const Donations = require("../models/Donations.model");
const cors = require("cors");
const {isAuthenticated} = require("../middleware/jwt.middleware");
const Campaign = require("../models/Campaign.model");
const User = require("../models/User.model");

// Define cors
/* const corsOptions = {
    origin: ["http://localhost:5005"],
    optionsSuccessStatus: 200
}; */


// POST route to make a donation to an specific campaign <<<- STATUS = WORKING !
router.post("/user/:id/campaign/:id/donations", async (req, res) => {
   const { id } = req.params;

    try {
    const { 
            amount,
            paymentMethod, 
            comments
        } = req.body;
        const newDonation = await Donations.create({
            amount,
            paymentMethod,
            comments
        });
        await Campaign.findByIdAndUpdate(id, {
            $push: {donations: newDonation}
        })

        await User.findByIdAndUpdate(id, {
            $push: {donations: newDonation}
        })
        res.json(newDonation);
    }
    catch (error) {
        return res.status(500).json({message: error.message});
    }
} )


// GET Route to get all the donations from the DB - STATUS = WORKING - but dont retun the campaign id:
router.get("/donations", async (req, res, next) => {
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