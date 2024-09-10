const Post =require("../models/post");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");



exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.send(posts);
    } catch (err) {
        logger.error(`Error getting posts: ${err.message}`);
        next(err);
    }
};
//////////////////////////////////////////////////////////////////

// exports.getuserPosts = async (req, res, next) => {
//     try {
//         const posts = await Post.find({userId:req.user.id});   // واحط ع الروت بتاعتها ال auth
//         res.send(posts);
//     } catch (err) {
//         logger.error(`Error getting posts: ${err.message}`);
//         next(err);
//     }
// };

exports.getuserPosts = async (req, res, next) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        return next(new AppError("No post found with that ID", 404));
      }
      res.send({ status: "success", data: { post } });
    } catch (err) {
      logger.error(`Error getting post: ${err.message}`);
      next(err);
    }
  };
////////////////////////////////////////////////////////////////////
exports.createPost = async (req, res, next) => {
    try {
        const { title, description, images } = req.body;
        const post = new Post({ title, description, images });
        await post.save();
        res.send({ msg: "Post created", post });
    } catch (err) {
        logger.error(`Error creating post: ${err.message}`);
        next(err);
    }
};

exports.upDatepost = async (req, res, next) => {
    try {
        const newTitle = req.body.title;
        const oldTitle = req.params.title;
        await Post.updateOne({ title: oldTitle }, req.body);
        res.send("Update done");
    } catch (err) {
        logger.error(`Error updating post: ${err.message}`);
        next(err);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const deletedpost = req.params.title;
        await Post.deleteOne({ title: deletedpost });
        res.send("Deleted done");
    } catch (err) {
        logger.error(`Error deleting post: ${err.message}`);
        next(err);
    }
};