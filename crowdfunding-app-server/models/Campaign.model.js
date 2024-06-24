const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const CampaignSchema = new Schema({
    title: { type: String, required: true },
    campaignImage: { type: String, default: "" },
    cause: { type: String, required: true, enum: ['Education', 'Health', 'Emergency', 'Dreams', 'Others'] },
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    images: [{ type: String, default: "" }],
    status: { type: [String], enum: ['active', 'completed', 'canceled'], default: 'active' }, // possibility to use virtual properties here.
    promoter: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    promIntroduction: { type: String, default: '' },
    budget: { type: String, default: "" },
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donations' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
   });
   
   CampaignSchema.virtual('daysLeft').get(function() {
    const endDate = new Date(this.endDate);
    const currentDate = new Date();
    const differenceMs = endDate.getTime() - currentDate.getTime();
    if (differenceMs < 0) {
        return 0;
    }
    const daysLeft = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
    return daysLeft;
});

// Virtual property to calculate currentAmountCopy code
CampaignSchema.virtual('currentAmount').get(async function() {
    try {
        console.log('Calculating currentAmount for campaign:', this._id);
        
        const totalAmount = await mongoose.model('Donations').aggregate([
            { $match: { campaign: this._id } }, // Filter donations for the current campaign
            { $group: { _id: null, totalAmount: { $sum: '$amount' } } } // Calculate the total sum of donation amounts
        ]);

        //console.log('Total amount:', totalAmount);

        // If there's no result or the total amount is null or undefined, return 0
        if (!totalAmount || totalAmount.length === 0 || !totalAmount[0].totalAmount) {
            return 0;
        }
        /* const currentAmount = totalAmount[0].totalAmount;
        console.log('Current amount:', currentAmount); */
        //return currentAmount;
        const currentAmount = totalAmount[0].totalAmount;
        //console.log('Current amount:', currentAmount);
        return currentAmount;
        
    } catch (error) {
        console.error('Error calculating current amount:', error);
        return 0; // Return 0 in case of error
    }
});

// Virtual property to calculate percentage completion
CampaignSchema.virtual('progressPercentage').get(async function() {
    try {
        console.log("Calculating progress percentage...");
        
        // Check if currentAmount and goalAmount are valid
        //console.log("Current amount:", this.currentAmount);
        //console.log("Goal amount:", this.goalAmount);

        // Wait for the currentAmount promise to resolve
        const currentAmount = await this.currentAmount;

        // Calculate progress percentage
        const progress = (currentAmount / this.goalAmount) * 100;

        //console.log("Progress:", progress);
        
        // Return the progress percentage
        return Math.round(progress);
    } catch (error) {
        console.error('Error calculating progress percentage:', error);
        return 0; // Return a default value or handle the error appropriately
    }
});

   const Campaign = mongoose.model("Campaign", CampaignSchema);
   module.exports = Campaign;