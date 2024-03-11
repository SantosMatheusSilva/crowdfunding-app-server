/* const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonatorSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaing' },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true, enum: [ 'credit_card', 'paypal', 'other '] }, 
})


const Donator = mongoose.model("Donator", DonatorSchema);
module.exports = Donator;
 */