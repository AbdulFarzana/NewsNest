const express = require("express");
const Post = require("../models/Post");
const protect = require("../middleware/authmiddleware");

const router = express.Router();

// ==========================================
// FORMAT POST
// ==========================================

const formatPost = (post, userId) => {
  return {
    id: post._id.toString(),

    user: post.user.toString(),

    userName: post.userName,

    userRole: post.userRole,

    userAvatar: post.userAvatar,

    content: post.content,

    category: post.category,

    publishedAt: post.createdAt,

    likes: post.likes,

    isLiked: post.likedBy.some(
      id => id.toString() === userId.toString()
    ),

    clubName: post.clubName,

    images: post.images,

    comments: post.comments.map(comment => ({
      id: comment._id.toString(),

      user: comment.user.toString(),

      userName: comment.userName,

      userRole: comment.userRole,

      content: comment.content,

      publishedAt: comment.publishedAt
    }))
  };
};

// ==========================================
// GET ALL POSTS
// ==========================================

router.get("/", protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 });

    const userId = req.user._id.toString();

    const formattedPosts = posts.map(post =>
      formatPost(post, userId)
    );

    return res.status(200).json({
      success: true,
      posts: formattedPosts
    });

  } catch (error) {
    console.error("Get posts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts"
    });
  }
});

// ==========================================
// CREATE POST
// ==========================================

router.post("/", protect, async (req, res) => {
  try {
    const {
      content,
      category,
      clubName,
      images
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content cannot be empty."
      });
    }

    const newPost = await Post.create({
      user: req.user._id,

      userName: req.user.name,

      userRole: req.user.role || "Student",

      userAvatar:
        req.user.avatar ||
        req.user.avatarUrl ||
        "",

      content: content.trim(),

      category:
        category ||
        "General Discussion",

      clubName:
        clubName || "",

      images:
        Array.isArray(images)
          ? images
          : []
    });

    const formattedPost = formatPost(
      newPost,
      req.user._id.toString()
    );

    return res.status(201).json({
      success: true,

      post: formattedPost,

      message: "Post published successfully"
    });

  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create post"
    });
  }
});

// ==========================================
// LIKE / UNLIKE POST
// ==========================================

router.post("/:id/like", protect, async (req, res) => {
  try {
    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found."
      });
    }

    const userId =
      req.user._id.toString();

    const alreadyLiked =
      post.likedBy.some(
        id =>
          id.toString() === userId
      );

    if (alreadyLiked) {
      post.likedBy =
        post.likedBy.filter(
          id =>
            id.toString() !== userId
        );

      post.likes =
        Math.max(
          0,
          post.likes - 1
        );

    } else {
      post.likedBy.push(
        req.user._id
      );

      post.likes += 1;
    }

    await post.save();

    return res.status(200).json({
      success: true,

      likes: post.likes,

      isLiked: !alreadyLiked
    });

  } catch (error) {
    console.error(
      "LIKE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update like"
    });
  }
});

// ==========================================
// ADD COMMENT
// ==========================================

router.post(
  "/:id/comment",
  protect,
  async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Comment text cannot be empty."
        });
      }

      const post =
        await Post.findById(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found."
        });
      }

      const newComment = {
        user: req.user._id,

        userName:
          req.user.name,

        userRole:
          req.user.role ||
          "Student",

        content:
          text.trim()
      };

      post.comments.push(
        newComment
      );

      await post.save();

      const formattedPost =
        formatPost(
          post,
          req.user._id.toString()
        );

      return res.status(200).json({
        success: true,

        post: formattedPost,

        message:
          "Comment added successfully"
      });

    } catch (error) {
      console.error(
        "Comment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to add comment"
      });
    }
  }
);

// ==========================================
// DELETE POST
// ONLY POST OWNER CAN DELETE
// ==========================================

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const post =
        await Post.findById(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found."
        });
      }

      const postOwnerId =
        post.user.toString();

      const loggedInUserId =
        req.user._id.toString();

      if (
        postOwnerId !==
        loggedInUserId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to delete this post."
        });
      }

      await Post.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Post deleted successfully.",
        postId:
          req.params.id
      });

    } catch (error) {
      console.error(
        "Delete post error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete post."
      });
    }
  }
);

// ==========================================
// DELETE COMMENT
// ONLY COMMENT OWNER CAN DELETE
// ==========================================

router.delete(
  "/:postId/comment/:commentId",
  protect,
  async (req, res) => {
    try {
      const post =
        await Post.findById(
          req.params.postId
        );

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found."
        });
      }

      const comment =
        post.comments.id(
          req.params.commentId
        );

      if (!comment) {
        return res.status(404).json({
          success: false,
          message:
            "Comment not found."
        });
      }

      const commentOwnerId =
        comment.user.toString();

      const loggedInUserId =
        req.user._id.toString();

      if (
        commentOwnerId !==
        loggedInUserId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to delete this comment."
        });
      }

      post.comments.pull(
        req.params.commentId
      );

      await post.save();

      return res.status(200).json({
        success: true,
        message:
          "Comment deleted successfully."
      });

    } catch (error) {
      console.error(
        "Delete comment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete comment."
      });
    }
  }
);

module.exports = router;