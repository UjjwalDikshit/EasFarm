const mongoose = require('mongoose');


const blogInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  type: {
    type: String,
    enum: ["view", "like", "comment", "read"]
  },
  duration: Number // seconds (for read)
}, { timestamps: true });

module.exports = mongoose.model("BlogInteraction", blogInteractionSchema);
