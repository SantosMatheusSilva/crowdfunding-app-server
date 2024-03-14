// Necessary imports
const User = require("../models/User.model");
const router = require("express").Router();
const Campaign = require("../models/Campaign.model");
const Comment = require("../models/Comment.model");
const cors = require("cors");
const {isAuthenticated} = require("../middleware/jwt.middleware");
const {ObjectId} = require("mongoose").Types;


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
router.get("/campaigns/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const campaign = await Campaign.findById(id)
        .populate("donations")
        .populate("promoter")
        .populate({path: 'comments',
        populate: {
          path: 'user',
          model: 'User'
        } })
        if(!campaign) {
            throw new Error ("error found");
        }

        res.json(campaign);
    }
    catch (error) {
        next(error);
    }
});

// PUT Route to update an specifc campaign by its id - STATUS = checked
router.put("/user/:userId/campaigns/:campaignId", async (req, res, next) => {
    try {
      const { userId, campaignId } = req.params;
      const { title, goalAmount, endDate, campaignImage, status, budget } = req.body;
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

/*  GET Route to get the donations of an specific campaign by its id */
// USe populate - STATUS = checked
router.get("/campaigns/:id/donations", async(req, res) => {
    try{
        const {id} = req.params;
        const campaign = await Campaign.findById(id)
        .populate({path: "donations"
        , populate: {
            path:"donor",
            model: "User"
        }});
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
router.delete("/user/:userId/campaigns/:campaignId", async(req, res, next) => {
    const { userId, campaignId } = req.params;
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

// routes for the comments 
router.post("/user/:userId/campaigns/:campaignId/comments", async(req, res, next) => {
    const {userId, campaignId} = req.params;
    try{
        const { user ,comment } = req.body;
        
        // heere wee create a new comment in the campaign
        const newComment = await Comment.create({
            user: userId,
            comment,
            campaign: campaignId, 
        })

        // here we add comment to the campaign
        await Campaign.findByIdAndUpdate(campaignId, {
            $push: {comments: newComment}
        }, { new: true });
        // await Comment.findById(id).populate("user");
        await newComment.populate("user");
        res.json(newComment);
        res.json(updatedCampaign);
    }catch (error) {
        next(error);
    }
})
// get routes to  all  commeents for a speecific campaign 
router.get('/campaigns/:id/comments',async (req, res, next)=>{
    const {id} = req.params
    try{
        const comments = await Comment.find({ campaign: id }).populate('user');
        res.json(comments);
    }
    catch (error) {
        next(error);
    }
})



//THIS IS THE DELETE ROUTE FOR A SPECIFIC ROUTTR
router.delete('/user/:userId/campaigns/:campaignId/comments/:commentId', async(req, res, next) => {
    //const { campaignId, commentId } = req.params;
    //Comment.findByIdAndDelete(req.params.commentId)
    try {
        if (!ObjectId.isValid(req.params.commentId)) {
          return res.status(400).json({ message: 'Invalid commentId' });
        }
    
        if (!ObjectId.isValid(req.params.userId)) {
          return res.status(400).json({ message: 'Invalid userId' });
        }
    
        const comment = await Comment.findById(req.params.commentId);
    
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
    
        if (comment.user._id.toString() !== req.params.userId.toString()) {
          return res.status(403).json({ message: 'Forbidden: You are not allowed to delete this comment' });
        }
    
        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ message: 'Comment deleted' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
});

module.exports = router;
/* 

    try /* {
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if(!deletedComment) {
            throw new Error ("Comment not found");
        }
        res.json({ message: "Comment deleted",  });
    } */
    /*{
        () => {
            res.send()
        }
    }
    catch (error) {
        next(error);
    }
})
*/