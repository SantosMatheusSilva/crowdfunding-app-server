// Necessary imports:
const router = require("express").Router();
const Institutions = require("../models/Institutions.model.js");
const cors = require("cors");


// Define cors 
const corsOptions = {
    origin: ["http://localhost:5005"],
    optionsSuccessStatus: 200
};

// POST Route for creating/ adding  a new institution
router.post("/intitutions", cors(corsOptions), async (req, res, next) => {
    try{
        const{
            name,
            type,
            description,
            address,
            phone,
            email,
            image,
            status
        } = req.body;
        const newInstitution = await Institutions.create({
            name,
            type,
            description,
            address,
            phone,
            email,
            image,
            status
        });
        if(!newInstitution){
            throw new Error ("error found")
        }
        res.json(newInstitution);
    }
    catch(error) {
        next(error);
    }
});


// GET Route for getting all institutions
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

// GET Route to get one specific institution by id 
router.get("/intitutions/:id", cors(corsOptions), async (req, res, next) => {
    try {
        const { id } = req.params;
        const cohort = await Institutions.findById(id);
        if(!institutions){
            throw new Error ("error found")
        }
        res.json(institutions);
    }
    catch (error) {
        next(error);
    }
});

// PUT Route to update an specifc institution by its id 
router.put("/institutions/:id", cors(corsOptions), async(req, res, next) => {
    Institutions.findByIdAndUpdate(req.params.id, req.body, {new: true});
    try {
        (updateInstitution) => {
            if(!updateInstitution){
                throw new Error ("error found");
            }

            res.json(updateInstitution);
        };
    }
    catch(error) {
        next(error);
    }
});

// DELETE Route to delete an institution by its id
router.delete("/institutions/:id", cors(corsOptions), async(req, res, next) => {
    Institutions.findByIdAndDelete(req.params.id);
    try{
        () => {
        res.json({message: "Institution deleted"});
        };
    }
    catch(error) {
        next(error);
    }
});

module.exports = router;
