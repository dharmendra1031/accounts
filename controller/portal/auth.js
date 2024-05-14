require("dotenv/config");
var User = require("../../model/user");

const Transaction = require("../../model/transaction");

async function disable_user(req, res) {
    var req_body = req.body;
    var user_id = req_body.user_id;
    User.findOneAndUpdate({ _id: user_id }, { $set: { status: "DISABLED" } })
        .then((data) => {
            if (data == null) {
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json({ message: "User disabled" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
}

async function enable_user(req, res) {
    var req_body = req.body;
    var user_id = req_body.user_id;
    User.findOneAndUpdate({ _id: user_id }, { $set: { status: "ENABLED" } })
        .then((data) => {
            if (data == null) {
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json({ message: "User enabled" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
}

async function delete_user(req, res) {
    var req_body = req.body;
    var user_id = req_body.user_id;
    User.findOneAndDelete({ _id: user_id })
        .then((data) => {
            res.status(200).json({ message: "User deleted" });
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
}

async function get_user_list(req, res) {
    var pageNo = req.query.pageNo || 1;
    var size = process.env.DEFAULT_PAGE_SIZE;
    var query = {};
    if (req.query.name) {
        query.name = req.query.name;
    }
    if (req.query.status) {
        query.status = req.query.status;
    }

    if (req.query.type) {
        query.type = req.query.type;
    }
    User.find(query)
        .skip(size * (pageNo - 1))
        .limit(size)
        .then((data) => {
            res.status(200).json({
                metadata: { pageNo: pageNo, pageSize: size },
                data: data,
            });
        })

        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
}

async function get_user(req, res) {
    var req_body = req.body;
    var user_id = req_body.user_id;
    User.findOne({ _id: user_id })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
}

async function get_transactions(req, res) {
    var pageNo = req.query.pageNo || 1;
    var size = process.env.DEFAULT_PAGE_SIZE;
    var query = {};
    console.log(req.query.pageNo );
    if (req.query.status) {
        query.status = req.query.status;
    }

    if (req.query.type) {
        query.type = req.query.type;
    }
    var isNextPage = false;
    var count = await Transaction.countDocuments(query);
    if(count  > pageNo * size){
        isNextPage = true
    }else{
        isNextPage = false
    }
    Transaction.find(query)
        .skip(size * (pageNo - 1))
        .limit(size)
        .then((data) => {
            res.status(200).json({
                metadata: { pageNo: pageNo, pageSize: size, count: count, isNextPage: isNextPage},
                data: data,
            });
        })

        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
}

async function accept_transaction(req, res) {
    var req_body = req.body;
    var transaction_id = req_body.transaction_id;
    Transaction.findOneAndUpdate(
        { _id: transaction_id },
        { $set: { status: "SUCCESS" } }
    )
        .then((data) => {
            if (data == null) {
                res.status(200).json({ message: "Transaction not found" });
            } else {
                res.status(200).json({ message: "Transaction accepted" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
}
async function reject_transaction(req, res) {
    var req_body = req.body;
    var transaction_id = req_body.transaction_id;
    Transaction.findOneAndUpdate(
        { _id: transaction_id },
        { $set: { status: "REJECTED" } }
    )
        .then((data) => {
            if (data == null) {
                res.status(404).json({ message: "Transaction not found" });
            } else {
                User.findOne({ _id: data.user_id })
                    .then((user) => {
                        user.walletBalance = user.walletBalance + data.amount;
                        user.save()
                            .then((data1) => {
                                res.status(200).json({
                                    message: "Transaction rejected",
                                });
                            })
                            .catch((error) => {
                                res.status(500).json({ error: error });
                            });
                    })
                    .catch((error) => {
                        res.status(500).json({ error: error });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
}

module.exports = {
    disable_user,
    enable_user,
    delete_user,
    get_user_list,
    get_user,
    get_transactions,
    accept_transaction,
    reject_transaction,
};
