const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    walletBalance: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: "ENABLED",
    },

    // referralCode: {
    //     type: String,
    //     unique: true,
    // },
    referredBy: {
        type: String,
        default: null,
    },
    referredUsers: {
        type: Array,
        default: [],
    },
    referralPoints: {
        type: Number,
        default: 0,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    eligibleForReferredBonus: {
        type: Boolean,
        default: false,
    },
    referredBonus: {
        type: Number,
        default: 0,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
