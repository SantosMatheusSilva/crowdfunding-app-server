const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DonationSchema = new Schema({
     amount: { type: Number, required: true },
     date: { type: Date, required: true },
     donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     paymentMethod: { type: String, required: true, enum: [ 'credit_card', 'paypal', 'other '] }, /* <<-- depends on the api we using to simulate payments*/
    /*  status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' }, */
     campaing: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaing' },
     Comments: {type: String, default: ''},
    });


    const Donation = mongoose.model("Donations", DonationSchema);
    module.exports = Donation;
