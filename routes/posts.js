const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPost,
  upDatepost,
  deletePost,
  getuserPosts,
} = require("../controller/posts.js");
const auth = require("./../middlewares/auth.js");
const restrictTo = require("../middlewares/authorization.js");
const { uploadImages, handleImages } = require("../middlewares/images.js");

router.get("/", getAllPosts);
router.post(
  "/",
  auth,
  restrictTo("user"),
  uploadImages([{ name: "images", count: 3 }]),
  handleImages("images"),
  createPost
);
router.get("/:id", getuserPosts);
router.patch(
  "/:id",
  uploadImages([{ name: "images", count: 3 }]),
  handleImages("images"),
  upDatepost
);
router.delete("/:id", deletePost);

module.exports = router;
