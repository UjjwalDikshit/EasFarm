const mongoose = require('mongoose');


const blogInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "farmer" },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  type: {
    type: String,
    enum: ["view", "like", "comment", "read"]
  },
  duration: Number // seconds (for read)
}, { timestamps: true });

blogInteractionSchema.index(
  { blogId: 1, userId: 1, type: 1 },
  { unique: true }
);


module.exports = mongoose.model("BlogInteraction", blogInteractionSchema);
