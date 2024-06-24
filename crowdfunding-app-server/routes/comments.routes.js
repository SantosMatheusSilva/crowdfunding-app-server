
const router = require("express").Router();
const {isAuthenticated} = require("../middleware/jwt.middleware");
const {ObjectId} = require("mongoose").Types;
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Campaign = require("../models/Campaign.model");
const Comment = require("../models/Comment.model");
const Institutions = require("../models/Institutions.model");

// routes for the comments 
/* router.post("/user/:userId/campaigns/:campaignId/comments", isAuthenticated, async (req, res, next) => {
    const { userId, campaignId } = req.params;
    const { comment } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId' });
        }

        // Create a new comment
        const newComment = await Comment.create({
            user: userId,
            comment,
            campaign: campaignId,
        });

        // Add the comment to the campaign
        await Campaign.findByIdAndUpdate(campaignId, {
            $push: { comments: newComment._id }
        }, { new: true });

        // Populate the user field of the comment
        await newComment.populate("user");

        // Send the new comment as a response
        res.json(newComment);
    } catch (error) {
        next(error);
    }
}); */

 router.post("/user/:userId/campaigns/:campaignId/comments", async(req, res, next) => {
    const {userId, campaignId, id} = req.params;
    try{
        const {comment} = req.body;
        
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
        await Comment.findById(id).populate("user");
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



// Delete route for an specif comment 
router.delete('/user/:userId/campaigns/:campaignId/comments/:commentId', async(req, res, next) => {
    const { userId, commentId, campaignId } = req.params;
    try {
        console.log('userId', userId);
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
          return res.status(400).json({ message: 'Invalid commentId' });
        }
    
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid userId' });
        }
    
        const comment = await Comment.findById(commentId);
    
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
        console.log('comment', comment);
        console.log('comment.user', comment.user);
        if (!comment.user || comment.user._id.toString() !== userId.toString()) {
          return res.status(403).json({ message: 'Forbidden: You are not allowed to delete this comment' });
        }
    
        await Comment.findByIdAndDelete(commentId);
        res.json({ message: 'Comment deleted' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
});
 
module.exports = router;