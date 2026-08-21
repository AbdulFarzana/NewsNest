const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
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

        category: {
            type: String,
            enum: [
                "Fest",
                "Annual Day",
                "Workshop",
                "Seminar",
                "Hackathon",
                "Auditorium",
                "Resume Session",
                "Placement",
                "Other"
            ],
            default: "Other"
        },

        venue: {
            type: String,
            required: true,
            trim: true
        },

        startDateTime: {
            type: Date,
            required: true
        },

        endDateTime: {
            type: Date,
            required: true
        },

        registrationDeadline: {
            type: Date,
            required: true
        },

        registrationLink: {
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
    "Event",
    eventSchema
);