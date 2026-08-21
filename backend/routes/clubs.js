const express = require("express");

const {
  getClubPosts,
  createClubPost,
  getClubPostImage,
  deleteClubPost
} = require("../controller/clubController");

const protect = require(
  "../middleware/authmiddleware"
);

const upload = require(
  "../middleware/clubUpload"
);

const router = express.Router();

router.get(
  "/",
  protect,
  getClubPosts
);

router.post(
  "/",
  protect,
  upload.single("image"),
  createClubPost
);

router.get(
  "/:id/image",
  getClubPostImage
);

router.delete(
  "/:id",
  protect,
  deleteClubPost
);

module.exports = router;