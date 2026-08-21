const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
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

        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "Mid Exams",
                "Semester Exams",
                "College Updates",
                "Company Drives",
                "Placements",
                "General"
            ],
            default: "General"
        },

        imageId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        imageContentType: {
            type: String,
            default: ""
        },

        link: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Announcement",
    announcementSchema
);