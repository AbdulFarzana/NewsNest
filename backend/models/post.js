const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    userRole: {
        type: String,
        default: "Student"
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    publishedAt: {
        type: Date,
        default: Date.now
    }
});

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        userName: {
            type: String,
            required: true
        },

        userRole: {
            type: String,
            default: "Student"
        },

        userAvatar: {
            type: String,
            default: ""
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            default: "General Discussion"
        },

        clubName: {
            type: String,
            default: ""
        },

        images: {
            type: [String],
            default: []
        },

        likes: {
            type: Number,
            default: 0
        },

        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        comments: {
            type: [commentSchema],
            default: []
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Post", postSchema);