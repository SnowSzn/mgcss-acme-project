const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  article: { type: Schema.Types.ObjectId, ref: "Article", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, maxlength: 500, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
