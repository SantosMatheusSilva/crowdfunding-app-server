// necessary imports 
const router = require("express").Router();
const User = require("../models/User.model.js");
const cors = require("cors");
const {isAuthenticated} = require("../middleware/jwt.middleware");


// Initialize cors for the further routes use.
const corsOptions = {
    origin: ["http://localhost:5005"],
    optionsSuccessStatus: 200
}

/* const authenticateUser = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.sendStatus(401).json({message: "Unauthorized"});
    }
}; */

// GET /api/user/:id
router.get("/user/:id", cors(corsOptions), isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
    console.log('Reading our user',user)
    try {if (!User){throw new Error ("error found");}
}
catch(error){
    next(error);
}  
})

//GET route to the campaigns of an specific user 
router.get("/user/:id/campaigns", cors(corsOptions), isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    const campaigns = await User.findById(id).populate("campaigns");
    res.json(campaigns);
    try {if (!User){throw new Error ("error found");}}
    catch(error){
        next(error);
    }
})

// GET route to the donations of an specific user 
router.get("/user/:id/donations", cors(corsOptions), isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    const donations = await User.findById(id).populate("donations");
    res.json(donations);
    try {if (!User){throw new Error ("error found");}}
    catch(error){
        next(error);
    }
})


module.exports = router; 
