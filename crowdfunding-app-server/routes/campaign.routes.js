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

    }
    catch (error) {
        next(error);
    }
})