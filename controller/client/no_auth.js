
const common = require("../../common");
var jwt = require("jsonwebtoken");

var fs = require("fs");
var path = require("path");
const User = require("../../model/user");
const private_key = fs.readFileSync(
    path.join(__dirname, "../../keys/private.key"),
    "utf8"
);

async function generate_token(user_id) {
    return new Promise((resolve, reject) => {
        var payload = {
            user_id: user_id,
        };

        var sign_options = {
            issuer: process.env.ISSUER,
            subject: process.env.SUBJECT,
            audience: process.env.AUDIENCE,
            expiresIn: process.env.EXPIRESIN,
            algorithm: process.env.ALGORITHM,
        };

        jwt.sign(payload, private_key, sign_options, function (err, token) {
            if (err)
                reject({
                    status: 403,
                    response: { error: "Failed generating token" },
                });
            else resolve(token);
        });
    });
}

function login(req, res) {
    var req_body = req.body;
    console.log(req_body.phone, req_body);
    User.findOne({ phone: req_body.phone })
        .then((data) => {
            if (data == null) {
                console.log("create user");
                create_user(req_body)
                    .then((data) => {
                        res.status(200).json(data);
                    })
                    .catch((err) => {
                        res.status(500).json({
                            error: err,
                        });
                    });
            } else {
                console.log("login");
                generate_token(data._id)
                    .then((token) => {
                        res.status(200).json({
                            token: token,
                            user_id: data._id,
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            error: err,
                        });
                    });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
}

async function create_user(data) {
    return new Promise((resolve, reject) => {
        common
            .generate_name()
            .then((username) => {
                console.log("Generated name: " + username);
                var user = User({
                    username: username,
                    phone: data.phone,
                });
                user.save()
                    .then((data) => {
                        console.log(data);
                        generate_token(data._id)
                            .then((token) => {
                                console.log(token);
                                resolve({
                                    token: token,
                                });
                            })
                            .catch((err) => {
                                console.error(
                                    "An error occurred while processing in function token : "
                                );
                                reject({
                                    error: err,
                                });
                            });
                    })
                    .catch((err) => {
                        console.error(
                            "An error occurred while processing in function login: "
                        );
                        reject({
                            error: err,
                        });
                    });
            })
            .catch((err) => {
                console.error(
                    "An error occurred while processing in function generate_name: "
                );
                reject({
                    error: err,
                });
            });
    });
}

module.exports = {
    login,
};
