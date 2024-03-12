// Necessary imports:
const router = require("express").Router();
const Institutions = require("../models/Institutions.model.js");
const cors = require("cors");


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
        const newInstitution = await Institutions.create({
            name,
            type,
            description,
            address,
            phone,
            email,
            images,
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
router.get("/institutions/:id", cors(corsOptions), async (req, res, next) => {
    try {
        const { id } = req.params;
        const institutions = await Institutions.findById(id);
        if(!institutions){
            throw new Error ("error found")
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
        const { id } = req.params;
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
router.get("/institutions/:id/donations", async(req, res) => {
    try{
        const {id} = req.params;
        const institutions = await Institutions.findById(id).populate("donations");
        if(!institutions) {
            throw new Error ("error found");    
        }

        res.json(institutions);
    }
    catch(error) {
        next(error);
    }
})

// DELETE Route to delete an institution by its id
router.delete("/institutions/:id", cors(corsOptions), async(req, res, next) => {
    const { id } = req.params;
    try {
        const deletedInstitution = await Institutions.findByIdAndDelete(id);
        if(!deletedInstitution){ {
            throw new Error ("error found");
        }
        }
        res.json({ message: "Institution deleted" /* institution: deletedInstitution */ });
    }
    catch(error) {
        next(error);
    }
});


module.exports = router;
