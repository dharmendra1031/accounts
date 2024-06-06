const User = require("../../model/user");
const Transaction = require("../../model/transaction");
const UserTrades = require("../../model/user_trades");
require("dotenv/config");

async function profile(req, res) {
  var req_body = req.body;
  var user_id = req_body.user_id;
  User.findOne({ _id: user_id })
    .then((data) => {
      if (data == null) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

async function withdrawals(req, res) {
  var req_body = req.body;
  var user_id = req_body.user_id;
  var amount = req_body.amount;
  var account_id = req_body.account_id;
  var user = await User.findOne({ _id: user_id });
  if (user == null) {
    res.status(404).json({ message: "User not found" });
  } else {
    if (user.walletBalance < amount) {
      res.status(400).json({ message: "Insufficient balance" });
    } else {
      user.walletBalance = user.walletBalance - amount;

      user
        .save()
        .then((data) => {
          var transaction = new Transaction({
            amount: amount,
            description: "Withdrawal",
            type: "WITHDRAWAL",
            account_id: account_id,
            user_id: user_id,
            date: new Date(),
            status: "PENDING",
            statusCode: 200,
            transaction_id: "TXN" + new Date().getTime(),
            walletBalance: data.walletBalance,

            payment_currency: "INR",
          });
          transaction
            .save()
            .then((data1) => {
              res.status(200).json({
                message: "Withdrawal successful",
              });
            })
            .catch((err) => {
              res.status(500).json({ error: err });
            });
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }
  }
}

async function deposit(req, res) {
  var req_body = req.body;
  var user_id = req_body.user_id;
  var amount = req_body.amount;
  var user = await User.findOne({ _id: user_id });
  if (user == null) {
    res.status(404).json({ message: "User not found" });
  } else {
    user.walletBalance = user.walletBalance + amount;

    user
      .save()
      .then((data) => {
        var transaction = new Transaction({
          amount: amount,
          description: "Deposit",
          type: "DEPOSIT",
          user_id: user_id,
          date: new Date(),
          status: "SUCCESS",
          statusCode: 200,
          transaction_id: "TXN" + new Date().getTime(),
          walletBalance: data.walletBalance,

          payment_currency: "INR",
        });
        transaction.save();
        res.status(200).json({ message: "Deposit successful" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

async function addBonus(req, res) {
  var req_body = req.body;
  var user_id = req_body.user_id;
  var amount = req_body.amount;
  var user = await User.findOne({ _id: user_id });
  if (user == null) {
    res.status(404).json({ message: "User not found" });
  } else {
    user.walletBalance = user.walletBalance + amount;
    user.referralPoints = user.referralPoints + amount;
    user
      .save()
      .then((data) => {
        var transaction = new Transaction({
          amount: amount,
          description: "Bonus",
          type: "BONUS",
          user_id: user_id,
          date: new Date(),
          status: "SUCCESS",
          statusCode: 200,
          transaction_id: "TXN" + new Date().getTime(),
          walletBalance: data.walletBalance,
          winningBalance: data.winningBalance,
          depositBalance: data.depositBalance,
          payment_currency: "INR",
        });
        transaction.save();
        res.status(200).json({ message: "Bonus added" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

async function get_user_transactions(req, res) {
  var pageNo = req.query.pageNo || 1;
  var size = process.env.DEFAULT_PAGE_SIZE;
  var query = {};

  if (req.query.user_id) {
    query.user_id = req.query.user_id;
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.type) {
    query.type = req.query.type;
  }
  console.log(query);
  var isNextPage = false;
  var count = await Transaction.countDocuments({ user_id: req.query.user_id });
  if (count > pageNo * size) {
    isNextPage = true;
  } else {
    isNextPage = false;
  }
  Transaction.find(query).sort({date: -1})
    .skip(size * (pageNo - 1))
    .limit(size)
    .then((data) => {
      res.status(200).json({
        metadata: JSON.stringify({
          pageNo: pageNo,
          pageSize: size,
          count: count,
          isNextPage: isNextPage,
        }),
        data: data,
      });
    })

    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

async function get_user_trade(req, res) {
  var pageNo = req.query.pageNo || 1;
  var size = process.env.DEFAULT_PAGE_SIZE;
  var query = {};

  if (req.query.user_id) {
    query.user_id = req.query.user_id;
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.type) {
    query.type = req.query.type;
  }
  console.log(query);
  var isNextPage = false;
  var count = await UserTrades.countDocuments({ user_id: req.query.user_id });
  if (count > pageNo * size) {
    isNextPage = true;
  } else {
    isNextPage = false;
  }
  UserTrades.find(query).sort({date: -1})
    .skip(size * (pageNo - 1))
    .limit(size)
    .then((data) => {
      res.status(200).json({
        metadata: JSON.stringify({
          pageNo: pageNo,
          pageSize: size,
          count: count,
          isNextPage: isNextPage,
        }),
        data: data,
      });
    })

    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

async function place_trade(req, res) {
  var req_body = req.body;
  var user_id = req_body.user_id;
  var amount = req_body.amount;
  var investment = req_body.investment;
  var bet_type = req_body.bet_type;
  var title = req_body.title;
  var subtitle = req_body.subtitle;
  var event_id = req_body.event_id;
  var event_type = req_body.event_type;
  var userTrades = UserTrades({
    amount: amount,
    investment: investment,
    bet_type: bet_type,
    title: title,
    subtitle: subtitle,
    event_id: event_id,
    event_type: event_type,
    user_id: user_id,
    date: new Date(),
    status: "PENDING",
    statusCode: 200,
    trade_id: "TXN" + new Date().getTime(),
  });

  userTrades
    .save()
    .then(async (data) => {
      var user = await User.findOne({ _id: user_id });
      user.walletBalance = (user.walletBalance - investment).toFixed(2);
      user
        .save()
        .then((data) => {
          res.status(200).json({ message: "Trade placed successfully" });
        })
        .catch((err) => {
          res.status(500).json({ message: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
}

module.exports = {
  profile,
  withdrawals,
  deposit,
  addBonus,
  get_user_transactions,
  get_user_trade,
  place_trade,
};
