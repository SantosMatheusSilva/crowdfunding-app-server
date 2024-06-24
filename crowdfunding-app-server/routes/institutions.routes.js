// Necessary imports:
const router = require("express").Router();
const Institutions = require("../models/Institutions.model.js");
const cors = require("cors");
const Comment = require('../models/Comment.model.js');
const Donations = require("../models/Donations.model.js");

// Define cors 
const corsOptions = {
    origin: ["http://localhost:5005"],
    optionsSuccessStatus: 200
};

// POST Route for creating/ adding  a new institution - STATUS = WORKING
router.post("/institutions", cors(corsOptions), async (req, res, next) => {
    try{
        const{
            name,
            type,
            description,
            address,
            phone,
            email,
            images,
            status
        } = req.body;
        const newInstitution = await Institutions.create(req.body);
        res.json(newInstitution);
    }
    catch(error) {
        if(error.code === 11000) {
            res.status(409).json({message: "institution already exists"});
        }
        next(error);
    }
});


// GET Route for getting all institutions - STATUS = WORKING
router.get("/institutions", cors(corsOptions), async (req, res, next) => {
    try {
        const institutions = await Institutions.find();
        if(!institutions){
            throw new Error ("error found")
        }

        res.json(institutions);
    } catch (error) {
        next(error);
    }
});

// GET Route to get one specific institution by id - STATUS = WORKING
router.get("/institutions/:institutionId", cors(corsOptions), async (req, res, next) => {
    try {
        const {institutionId} = req.params;
        const institutions = await Institutions.findById(institutionId)
        .populate({path: "donations", populate:{ path: 'donations', model: 'Donations'}}) // populate the donation field with its related data from Donations collection
        .populate({path: 'comments', populate:{ path:'user', model: 'User'}}); // populate  the comments field with its related user info from User
        if(!institutions){
            throw new Error ("Institution not found")
        }
        res.json(institutions);
    }
    catch (error) {
        next(error);
    }
});

// PUT Route to update an specifc institution by its id - STATUS = WORKING
router.put("/institutions/:id", cors(corsOptions), async(req, res, next) => {
    try {
        const {id} = req.params;
        const { name,
                type,
                description,
                address,
                phone,
                email,
                images,
                status} = req.body;
        // The code bellow will check if any of the fields were left blank when updating
        // If so, it will return an error message // Front-end - keep the update institution form value fields filled.
        const isEmptyUpdate = Object.values(req.body).some(value => value === "" || value == null);
        if (isEmptyUpdate) {
            return res.status(400).json({ message: "One or more update fields are empty or undefined" });
        }
        const updatedInstitution = await Institutions.findByIdAndUpdate(id, { name, type, description, address, phone, email, images, status }, { new: true });
        if (!updatedInstitution) {
          throw new Error("Institution not found or not updated");
        }
        res.json({ message: "Institution updated", institution: updatedInstitution });
      } catch (error) {
        next(error);
      }

});

// GET Route to get the donations of an specific institution by its id 
router.get("/institutions/:id/donations", async(req, res, next) => {
    const {id} = req.params;
    try{
        const institutions = await Institutions.findById(id)
        .populate("donations")
        .catch((error)=> {
            next(error);
        });
        if(!institutions) {
            throw new Error ("Institution not found");
        }
        res.json(institutions);
    }
    catch(error) {
        next(error);
    }
})

// DELETE Route to delete an institution by its id
router.delete("/institutions/:id", cors(corsOptions), async(req, res, next) => {
    const {id} = req.params;
    try {
        const deletedInstitution = await Institutions.findByIdAndDelete(id);
        if(!deletedInstitution){ {
            throw new Error ("error found");
        }
        }
        res.json({ message: "Institution deleted"  });
    }
    catch(error) {
        next(error);
    }
});

// GET route for the instituion/:id comments
router.get("/institutions/:id/comments", async (req, res, next)=>{
    const {id} = req.params
    try{
        const comments = await Comment.find({ institution: id }).populate('user');
        res.json(comments);
    }
    catch (error) {
        next(error);
    }
})

// POST route for the instituion/:id comments
router.post("/user/:userId/institutions/:institutionId/comments", async(req, res, next) => {
    const {userId, institutionId} = req.params;
    try{
        const {user ,comment} = req.body;
        
        // heere wee create a new comment in the institution
        const newComment = await Comment.create({
            user: userId,
            comment,
            institution: institutionId, 
        })

        // here we add comment to the institution
        await Institutions.findByIdAndUpdate(institutionId, {
            $push: {comments: newComment}
        }, { new: true });
        // await Comment.findById(id).populate("user");
        await newComment.populate("user");
        res.json(newComment);
        res.json(updatedInstitution);
    }catch (error) {
        next(error);
    }
})

// DELETE  route for /institutions/:institutionId/comments/:commentId

router.delete('/user/:userId/institutions/:institutionId/comments/:commentId', async(req, res, next) => {
   
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
