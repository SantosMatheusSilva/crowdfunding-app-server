const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const CampaignSchema = new Schema({
    title: { type: String, required: true },
    cause: { type: String, required: true, enum: ['education', 'health', 'emergencies'] },
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    images: { type: String, default: "" },
    status: { type: String, enum: ['active', 'completed', 'canceled'], default: 'active' },
    promoter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    donators: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   });
   

   const Campaing = mongoose.model("Campaing", CampaignSchema);
   module.exports = Campaing;