// necessary imports 
const router = require("express").Router();
const User = require("../models/User.model.js");
const cors = require("cors");

// Initialize cors for the further routes use.
const corsOptions = {
    origin: ["http://localhost:5005"],
    optionsSuccessStatus: 200
}

const authenticateUser = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.sendStatus(401).json({message: "Unauthorized"});
    }
};

// GET /api/users
router.get("/user/:id", cors(corsOptions), authenticateUser, async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    try {if (!User){throw new Error ("error found");}
}
catch(error){
    next(error);
}  
})

module.exports = router; 
