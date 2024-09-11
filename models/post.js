const { model, Schema } = require("mongoose");
const postSchema = new Schema(
  {
    title: String,
    description: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    images: [String],
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
