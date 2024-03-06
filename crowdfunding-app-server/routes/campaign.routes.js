// Necessary imports
const router = require("express").Router();
const Campaign = require("../models/Campaign.model");
const cors = require("cors");

// Define Cors
const corsOptions = {
    origin: ["http://localhost:5005"],
    optionsSuccessStatus: 200
};

// POST Route to create a new campaign 
router.post("/campaign", cors(corsOptions), async (req, res, next) => {
    try {
        const {
            title,
            cause,
            description,
            goalAmount,
            startDate,
            endDate,
            images,
            status,
            promoter, /* How to turn this property automatic to the user whos creating it ?? */
        } = req.body;
        const newCampaign = await  Campaign.create({
            title,
            cause,
            description,
            goalAmount,
            startDate,
            endDate,
            images,
            status,
            promoter
        });
        if(!newCampaign){
            throw new Error("Error found");
        }

        res.json(newCampaign);
    }
    catch (error) {
        next(error);
    }
   
});

// GET Route to get all the campaigns
router.get("/campaigns", cors(corsOptions), async (req, res, next) => {
    try {
        const campaign = await Campaign.find();
        if(!campaign) {
            throw new Error ("error found");
        }

        res.json(campaign);
    }
    catch (error) {
        next(error);
    }
});

// GET Route to get an specific campaign by its id
router.get("/campaigns/:id", cors(corsOptions), async (req, res, next) => {
    try {
        const {id} = req.params;
        const campaign = await Campaign.findById(id);
        if(!campaign) {
            throw new Error ("error found");
        }

        res.json(campaign);
    }
    catch (error) {
        next(error);
    }
});

// PUT Route to update an specifc campaign by its id 
router.put("/campaigns/id", cors(corsOptions), async(req, res, next) => {
    Campaign.findByIdAndUpdate(req.params.id, req.body, {new: true});
    try{
        (updateCampaign) => {
            if(!updateCampaign) {
                throw new Error("error found");
            }

            res.json(updateCampaign);
        };
    }
    catch (error) {
        next(error);
    }
});

/*  GET Route to get the donations of an specific campaign by its id */
// USe populate ??


// DELETE Route to delete an specific campaign by its id
router.delete("/campaigns/:id", cors(corsOptions), async(req, res, next) => {
    Campaign.findByIdAndDelete(req.params.id);
    try {
        () => {
            res.json({message: "Campaign deleted"});
        };
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;
