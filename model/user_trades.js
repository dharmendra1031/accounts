const mongoose = require("mongoose");

const userTradesSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
 investment: {
    type: Number,
    required: true,
  },
  bet_type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },

  event_id: {
    type: String,
    required: true,
  },
  event_type: {
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
  trade_id: {
    type: String,
    // required: true,
  },
});

const UserTrades = mongoose.model("UserTrades", userTradesSchema);

module.exports = UserTrades;
