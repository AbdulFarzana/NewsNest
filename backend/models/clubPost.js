const mongoose = require("mongoose");

const clubPostSchema = new mongoose.Schema(
    {
        club: {
            type: String,
            required: true,
            enum: [
                "Culturals Club",
                "Sports Club",
                "Coding Club",
                "Creative Club",
                "AI Club",
                "Hackathon Club"
            ]
        },

        type: {
            type: String,
            required: true,
            enum: [
                "Event",
                "Achievement",
                "Winner",
                "Update"
            ],
            default: "Update"
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        venue: {
            type: String,
            default: "",
            trim: true
        },

        startDateTime: {
            type: Date,
            default: null
        },

        endDateTime: {
            type: Date,
            default: null
        },

        registrationDeadline: {
            type: Date,
            default: null
        },

        registrationLink: {
            type: String,
            default: "",
            trim: true
        },

        image: {
            type: Buffer,
            default: null
        },

        imageContentType: {
            type: String,
            default: ""
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        userName: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ClubPost",
    clubPostSchema
);