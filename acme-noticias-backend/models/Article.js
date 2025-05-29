const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  publishedAt: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  commentsDisabled: { type: Boolean, default: false },
  coverImage: { type: String },
  videoLinks: [String],
});

module.exports = mongoose.model("Article", ArticleSchema);
