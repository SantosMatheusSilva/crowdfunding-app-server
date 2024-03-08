const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const CampaignSchema = new Schema({
    title: { type: String, required: true },
    cause: { type: String, required: true, enum: ['education', 'health', 'emergencies', 'dreams', 'others'] },
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true },
    /* currentAmount: { type: Number, default: 0 }, */ // <<<--- possibility to use virtual property for this!
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    images: [{ type: String, default: "" }],
    status: { type: String, enum: ['active', 'completed', 'canceled'], default: 'active' }, // possibility to use virtual properties here.
    promoter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donations' }],
   });
   

   const Campaign = mongoose.model("Campaign", CampaignSchema);
   module.exports = Campaign;