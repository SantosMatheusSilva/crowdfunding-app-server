// necessary imports 
const router = require("express").Router();
const User = require("../models/User.model.js");
const Donations = require("../models/Donations.model.js");
const Campaigns = require("../models/Campaign.model.js");
const cors = require("cors");
const {isAuthenticated} = require("../middleware/jwt.middleware");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const {ObjectId} = require("mongoose").Types;


// Initialize cors for the further routes use.
const corsOptions = {
    origin: ["http://localhost:5005", "http://localhost:5173"],
    optionsSuccessStatus: 200
}

const authenticateUser = (req, res, next) => {
    if (!req.payload || !req.payload._id) {
        console.log('User not authenticated');
        if (!req) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if (!res || typeof res.status !== 'function' || typeof res.json !== 'function') {
            return res.status(500).json({ message: "Internal server error" });
        }
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log('User authenticated', req.payload);
    return next();
};


// GET /api/user/:id
router.get("/user/:id", cors(corsOptions), isAuthenticated, authenticateUser, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id)
            .populate("campaigns")
            .populate("donations")
            .lean()
            .exec();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Populate virtual fields manually
        const totalDonation = await User.populate(user, { path: 'totalDonation', options: { virtuals: true } });
        // Extract necessary fields from totalDonation
        user.totalDonation = totalDonation ? totalDonation.amount : 0; // Assuming 'amount' is the field you want to include
        //console.log("reading the user->", user);
        return res.json(user);
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    
});
/* router.get("/user/:id", cors(corsOptions), isAuthenticated, authenticateUser, async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id)
    .populate("campaigns")
    .populate("donations")
    .populate("totalDonation", null, null, { virtuals: true })

    try {
        if (!user){
            return res.status(404).json({message: "User not found"});
        }

    return res.json(user);
}
catch(error){
    return res.status(500).json({message: error.message})
}  
}) */

// PUT route to update an specific user
router.put("/user/:id", cors(corsOptions), isAuthenticated, authenticateUser, async (req, res, next) => {
    const {id} = req.params;
    const {name, email, password} = req.body;

    if (!await User.findById(id)) {
        return res.status(404).json({message: "User not found"});
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.findByIdAndUpdate(id, { name, email, password: hashedPassword });
    // The code bellow will check if any of the fields were left blank when updating
    const isEmptyUpdate = Object.values(req.body).some(value => value === "" || value == null);
    if (isEmptyUpdate) {
        return res.status(400).json({ message: "One or more update fields are empty or undefined" });
    }
    return res.json(user);
})

//GET route to the campaigns of an specific user 
router.get("/user/:id/campaigns", cors(corsOptions), isAuthenticated, authenticateUser, async (req, res, next) => {
    const {id} = req.params;
    const campaigns = await Campaigns.findById(id);
    try {
        if (!campaigns){
            return res.status(404).json({message: "Campaigns not found"});
        }
        return res.json(campaigns);
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
})

// GET route to the donations of an specific user 
router.get("/user/:id/donations", cors(corsOptions), isAuthenticated, authenticateUser, async (req, res, next) => {
    const { id } = req.params;
    try {
        const donations = await Donations.find({ user: id }).populate("campaign")
        if (!donations || donations.length === 0) {
            return res.status(404).json({ message: "Donations not found" });
        }
        return res.json(donations);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

/* router.get("/user/:id/donations", cors(corsOptions), isAuthenticated, authenticateUser, async (req, res, next) => {
    const {id} = req.params;
    const donations = await Donations.findById(id).populate("campaign");
    try {
        if (!donations){
            return res.status(404).json({message: "Donations not found"});
        }
        return res.json(donations);
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }

}) */


module.exports = router; 




/* const authenticateUser = (req, res, next) => {
    if (!req) {
        throw new Error('Request object is missing');
    }

    if (!res || typeof res.sendStatus !== 'function' || typeof res.json !== 'function') {
        throw new Error('Response object is missing or invalid');
    }

    if (typeof req.isAuthenticated !== 'function') {
        throw new Error('Request.isAuthenticated is missing or invalid');
    }

    if (req.isAuthenticated()) {
        console.log('User authenticated');
        return next();
    } else {
        console.log('User not authenticated');
        res.sendStatus(401).json({message: "Unauthorized"});
    }
}; */

/* const authenticateUser = (req, res, next) => {
    // Check if req.user exists, indicating the user is authenticated
    if (req && req.user) {
        console.log('User authenticated');
        return next();
    } else {
        console.log('User not authenticated');
        if (!req) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if (!res || typeof res.status !== 'function' || typeof res.json !== 'function') {
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(401).json({ message: "Unauthorized" });
    }
}; */
