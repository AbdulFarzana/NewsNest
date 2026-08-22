const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            default: 'student'
        },

        phone: {
            type: String,
            default: ''
        },

        rollNumber: {
            type: String,
            default: ''
        },

        location: {
            type: String,
            default: ''
        },

        department: {
            type: String,
            default: ''
        },

        year: {
            type: String,
            default: ''
        },

        interestedClubs: {
            type: [
                {
                    id: String,
                    name: String,
                    category: String
                }
            ],
            default: []
        },

        avatar: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);