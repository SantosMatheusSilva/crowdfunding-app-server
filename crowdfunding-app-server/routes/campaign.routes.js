// Necessary imports
const User = require("../models/User.model");
const router = require("express").Router();
const Campaign = require("../models/Campaign.model");
const cors = require("cors");
const {isAuthenticated} = require("../middleware/jwt.middleware");

// Define Cors
const corsOptions = {
    origin: ["http://localhost:5005"],
    optionsSuccessStatus: 200
};

// POST Route to create a new campaign - STATUS = checked, but the promoter value returns only the id.
router.post("/user/:id/campaign", cors(corsOptions), isAuthenticated, async (req, res, next) => {

    const {id} = req.params;
    /* const {User} = req; */

    try {
        const {
            title,
            cause,
            description,
            goalAmount,
            /* startDate, */
            endDate,
            images,
            /*  promoter, */  /* How to turn this property automatic to the user whos creating it ?? */
        } = req.body;
        const newCampaign = await  Campaign.create({
            title,
            cause,
            description,
            goalAmount,
            /* startDate, */
            endDate,
            images,
            promoter: id
        });

        await User.findByIdAndUpdate(id, {
            $push: {campaigns: newCampaign}
        }).populate("campaigns");

        if(!newCampaign){
            throw new Error("Error found");
        }

        res.json(newCampaign);
    }
    catch (error) {
        next(error);
    }
   
});

// GET Route to get all the campaigns - STATUS = checked 
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

// GET Route to get an specific campaign by its id - STATUS = checked
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

// GET route to get 
// PUT Route to update an specifc campaign by its id - STATUS = checked
router.put("/campaigns/:id", cors(corsOptions), async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, goalAmount, endDate, images, status } = req.body;
      // The code bellow will check if any of the fields were left blank when updating
      // If so, it will return an error message // Front-end - keep the update campaign form value fields filled.
      const isEmptyUpdate = Object.values(req.body).some(value => value === "" || value == null);
      if (isEmptyUpdate) {
          return res.status(400).json({ message: "One or more update fields are empty or undefined" });
      }
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        id,
        { title, goalAmount, endDate, images, status },
        { new: true }
      );
      if (!updatedCampaign) {
        throw new Error("Campaign not found or not updated");
      }
      res.json({ message: "Campaign updated", campaign: updatedCampaign });
    } catch (error) {
      next(error);
    }
  });

/*  GET Route to get the donations of an specific campaign by its id */
// USe populate - STATUS = checked
router.get("/campaigns/:id/donations", cors(corsOptions), async(req, res) => {
    try{
        const {id} = req.params;
        const campaign = await Campaign.findById(id).populate("campaign");
        if(!campaign) {
            throw new Error ("error found");    
        }

        res.json(campaign);
    }
    catch(error) {
        next(error);
    }
})

// DELETE Route to delete an specific campaign by its id - STATUS = checked
router.delete("/campaigns/:id", cors(corsOptions), async(req, res, next) => {
    const { id } = req.params;
    try {
        const deletedCampaign = await Campaign.findByIdAndDelete(id);
        if(!deletedCampaign) {
            throw new Error ("error found");
        }
        res.json({ message: "Campaign deleted", /* campaign: deletedCampaign */ });
    }
    catch (error) {
        next(error);
    }

})

module.exports = router;
