const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstitutionSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    about: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    images: { type: String, required: true },
    status: { type: [String], enum: ['active', "deactivated"], default: 'active' },
    geolocation: [{ type: String, default: '' }],
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donations' }], 
    comments:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})

const Institutions = mongoose.model("Institutions", InstitutionSchema);
module.exports = Institutions;