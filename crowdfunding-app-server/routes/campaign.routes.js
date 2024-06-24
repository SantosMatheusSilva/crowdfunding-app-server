// Necessary imports
const User = require("../models/User.model");
const router = require("express").Router();
const Campaign = require("../models/Campaign.model");
const Comment = require("../models/Comment.model");
const Donations = require("../models/Donations.model");
const cors = require("cors");
const {isAuthenticated} = require("../middleware/jwt.middleware");
const {ObjectId} = require("mongoose").Types;
const mongoose = require("mongoose");


// POST Route to create a new campaign - STATUS = checked, but the promoter value returns only the id.
router.post("/user/:userId/campaign", async (req, res, next) => {

    const {userId} = req.params;
    /* const {User} = req; */

    console.log('here');

    try {
        const {
            title,
            campaignImage,
            cause,
            description,
            goalAmount,
            /* startDate, */
            endDate,
            images,
            promIntroduction,
            budget
            /*  promoter, */  
        } = req.body;
        const newCampaign = await Campaign.create({
            title,
            campaignImage,
            cause,
            description,
            goalAmount,
            /* startDate, */
            endDate,
            images,
            promoter: userId,
            promIntroduction,
            budget
        });

        await User.findByIdAndUpdate(userId, {
            $push: {campaigns: newCampaign}
        })

        res.json(newCampaign);
    }
    catch (error) {
        return res.status(500).json({message: error.message})
    }
   
});

// GET Route to get all the campaigns - STATUS = checked 
router.get("/campaigns", async (req, res, next) => {
    try {
        const campaigns = await Campaign.find()
            .populate({ path: 'donations', populate: { path: 'user', model: 'User' } })
            .populate("promoter")
            .populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

        const serializedCampaigns = [];
        for (const campaign of campaigns) {
            const daysLeft = campaign.daysLeft;
            const currentAmount = await campaign.currentAmount;
            const progressPercentage = await campaign.progressPercentage;

            // Convert currentAmount to a number if it's not already
            const serializedCampaign = campaign.toObject();
            serializedCampaign.currentAmount = Number(currentAmount);
            serializedCampaign.progressPercentage = Number(progressPercentage);
            serializedCampaign.daysLeft = Number(daysLeft);

            serializedCampaigns.push(serializedCampaign);
        }

        res.json({ campaigns: serializedCampaigns});
    } catch (error) {
        next(error);
    }
});

// GET Route to get an specific campaign by its id - STATUS = checked
router.get("/campaigns/:campaignId", async (req, res, next) => {
    try {
        const {campaignId} = req.params;
        const campaign = await Campaign.findById(campaignId)
            .populate({ path: 'donations', populate: { path: 'user', model: 'User' } })
            .populate("promoter")
            .populate({ path: 'comments', populate: { path: 'user', model: 'User' } });

        if (!campaign) {
            throw new Error("Campaign not found");
        }

        // Accessing the virtual fields directly
        const daysLeft = campaign.daysLeft;
        const currentAmount = await campaign.currentAmount; // Ensure await here
        const progressPercentage = await campaign.progressPercentage;

        // Convert currentAmount to a number if it's not already
        const serializedCampaign = campaign.toObject(); // Convert Mongoose document to plain JavaScript object
        serializedCampaign.currentAmount = Number(currentAmount);
        serializedCampaign.progressPercentage = Number(progressPercentage);
        

        res.json({ campaign: serializedCampaign, daysLeft });
    } catch (error) {
        next(error);
    }
});

// PUT Route to update an specifc campaign by its id - STATUS = checked
router.put("/user/:userId/campaigns/:campaignId", async (req, res, next) => {
    try {
      const {userId, campaignId} = req.params;
      const {title, goalAmount, endDate, campaignImage, status, budget} = req.body;
      // The code bellow will check if any of the fields were left blank when updating
      // If so, it will return an error message // Front-end - keep the update campaign form value fields filled.
      const isEmptyUpdate = Object.values(req.body).some(value => value === "" || value == null);
      if (isEmptyUpdate) {
          return res.status(400).json({ message: "One or more update fields are empty or undefined" });
      }
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        campaignId,
        { title, goalAmount, endDate, campaignImage, budget, status },
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

router.get("/campaigns/:campaignId/donations", async(req, res) => {
    try{
        const {campaignId} = req.params;
        const donations = await Donations.find({campaign: campaignId}).populate('user');
        if(!donations) {
            throw new Error ("error found");    
        }
        res.json(donations);
    }
    catch(error) {
        next(error);
    }
})

// DELETE Route to delete an specific campaign by its id - STATUS = checked
router.delete("/user/:userId/campaigns/:campaignId", async(req, res, next) => {
    const {userId, campaignId} = req.params;
    try {
        const deletedCampaign = await Campaign.findByIdAndDelete(campaignId);
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
