import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  images: [
    {
      type: String // Store image URLs (e.g., from S3, Cloudinary)
    }
  ],
  dealType: {
    type: String,
    enum: ["fair", "unfair"],
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment" // Reference to comment model
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export models
export default mongoose.models.Post || mongoose.model("Post", PostSchema);

