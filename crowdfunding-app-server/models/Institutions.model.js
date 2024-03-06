const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstitutionSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed', 'canceled'], default: 'active' },
    /* donations: { type: mongoose.Schema.Types.ObjectId, ref: 'Donations' }, // Check the logic to relate these schemas.
    donors: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, */
})

const Institutions = mongoose.model("Institutions", InstitutionSchema);
module.exports = Institutions;