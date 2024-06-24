const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DonationSchema = new Schema({
     amount: { type: Number, required: true },
     currency: { type: String, default: "EUR" },
     date: { type: Date, default: Date.now },
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     paymentMethod: { type: String, required: true, enum: [ 'card'] }, /* <<-- depends on the api we using to simulate payments*/
     donationStatus: { type: String, enum: ['pending', 'completed', 'canceled']},
     campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' } || { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
     comments: {type: String, default: '', required: false },
     paymentIntentId: {type: String, default: '', required: false },
     clientSecret: {type: String, default: '', required: false },
    });


    const Donation = mongoose.model("Donations", DonationSchema);
    module.exports = Donation;
