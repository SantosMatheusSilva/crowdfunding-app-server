const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DonationSchema = new Schema({
     amount: { type: Number, required: true },
     date: { type: Date, default: Date.now },
     donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     paymentMethod: { type: String, required: true, enum: [ 'credit_card', 'paypal', 'other'] }, /* <<-- depends on the api we using to simulate payments*/
     status: { type: String, enum: ['pending', 'completed', 'canceled']}, 
     campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
     comments: {type: String, default: '', required: false },
    });


    const Donation = mongoose.model("Donations", DonationSchema);
    module.exports = Donation;
