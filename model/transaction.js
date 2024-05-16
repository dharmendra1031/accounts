const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    account_id: {
        type: String,
        // required: true,
    },
    type: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    statusCode: {
        type: Number,
        required: true,
    },
    transaction_id: {
        type: String,
        required: true,
    },

    walletBalance: {
        type: Number,
        required: true,
    },

    payment_currency: {
        type: String,
        required: true,
    },

});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
