// Necessary imports:
const router = require("express").Router();
const Donations = require("../models/Donations.model");
const cors = require("cors");
const {isAuthenticated} = require("../middleware/jwt.middleware");
const Campaign = require("../models/Campaign.model");
const User = require("../models/User.model");
const Institutions = require("../models/Institutions.model");


// POST route to make a donation to an specific campaign <<<- STATUS = WORKING !
router.post("/user/:id/campaign/:id/donations", async (req, res) => {
   const { id} = req.params;

    try {
    const { donor,
            amount,
            paymentMethod, 
            comments
        } = req.body;
        const newDonation = await Donations.create({
            donor,
            amount,
            paymentMethod,
            comments
        });
        await Donations.findById(id).populate("donor");
        await Campaign.findByIdAndUpdate(id, {
            $push: {donations: newDonation}
        });

        await User.findByIdAndUpdate(id, {
            $push: {donations: newDonation}
        }).populate("donations");
        res.json(newDonation);
    }
    catch (error) {
        return res.status(500).json({message: error.message});
    }
} )

// POST route to make a donation to an specific institution -<<<- STATUS = WORKING
router.post("/user/:id/institutions/:id/donations", async (req, res) => {
    const { id} = req.params;
 
     try {
     const { donor,
             amount,
             paymentMethod, 
             comments
         } = req.body;
         const newDonation = await Donations.create({
             donor,
             amount,
             paymentMethod,
             comments
         });
         await Donations.findById(id).populate("donor");
         await Institutions.findByIdAndUpdate(id, {
             $push: {donations: newDonation}
         });
 
         await User.findByIdAndUpdate(id, {
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
        .populate("donor");
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