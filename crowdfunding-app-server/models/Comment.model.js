// going to be an extra feature 
// userrs can post coments in a specifc campaign. 

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema ({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    /* institutions: {type: mongoose.Schema.Types.ObjectId, ref: 'Institutions' }, */
    date: { type: Date, default: Date.now },
})

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;