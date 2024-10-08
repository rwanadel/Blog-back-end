const Post = require("../models/post");
const User = require("../models/users");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

// exports.getAllPosts = async (req, res, next) => {
//   try {
//     const posts = await Post.find();
//     res.send(posts);
//   } catch (err) {
//     logger.error(`Error getting posts: ${err.message}`);
//     next(err);
//   }
// };

exports.getAllPosts = async (req, res, next) => {
  try {
    // Fetch posts and populate the 'user' field with the user's name
    const posts = await Post.find().populate("user"); // 'name' refers to the field in the User schema

    res.status(200).send({ posts });
  } catch (error) {
    next(error);
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
// exports.createPost = async (req, res, next) => {
//   try {
//     const { title, description, images, userId } = req.user._id;
//     const post = new Post({ title, description, images, userId });
//     await post.save();
//     res.send({ msg: "Post created", post });
//   } catch (err) {
//     logger.error(`Error creating post: ${err.message}`);
//     next(err);
//   }
// };

// exports.createPost = async (req, res, next) => {
//   let image;
//   if (req.body.image) image = req.body.image[0];
//   const post = await Post.create({
//     ...req.body,
//     user: req.user._id,
//     userName: req.user.name,
//     image,
//   });
//   if (!post) {
//     throw new AppError("Failed to create post", 500);
//   }
//   logger.info(`Post created: ${post._id}`);
//   res.status(201).json(post);
// };

// const getPosts = async (req, res, next) => {
//   const posts = await Post.find().populate("user");

//   res.status(200).send({ posts });
//   logger.info(`Fetched ${posts.length} posts`);
// };

// exports.upDatepost = async (req, res, next) => {
//   try {
//     const newTitle = req.body.title;
//     const oldTitle = req.params.title;
//     await Post.updateOne({ title: oldTitle }, req.body);
//     res.send("Update done");
//   } catch (err) {
//     logger.error(`Error updating post: ${err.message}`);
//     next(err);
//   }
// };

exports.createPost = async (req, res, next) => {
  let image;
  if (req.body.image) image = req.body.image[0];

  try {
    const user = await User.findById(req.user._id).select("name"); // Fetch the user's name
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const post = await Post.create({
      ...req.body,
      user: req.user._id,
      image,
    });

    if (!post) {
      throw new AppError("Failed to create post", 500);
    }

    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "name"
    ); // Populate user name
    logger.info(`Post created: ${populatedPost._id}`);

    res.status(201).json(populatedPost); // Send response with populated user details
  } catch (error) {
    next(error);
  }
};

exports.upDatepost = async (req, res, next) => {
  let image;
  if (req.body.image) image = req.body.image[0];
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { ...req.body, image },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!post) {
    throw new AppError("Post with ID: ${req.params.id} not found!", 404);
  }
  res.status(200).json(post);
  logger.info(`Post updated: ${post._id}`);
};

// exports.deletePost = async (req, res, next) => {
//   try {
//     const deletedpost = req.params.title;
//     await Post.deleteOne({ title: deletedpost });
//     res.send("Deleted done");
//   } catch (err) {
//     logger.error(`Error deleting post: ${err.message}`);
//     next(err);
//   }
// };
exports.deletePost = async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    throw new AppError("Post with ID: ${req.params.id} not found!", 404);
  }
  logger.info(`Post deleted: ${req.params.id}`);
  res.status(204).send();
};
