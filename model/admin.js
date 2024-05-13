const mongoose = require('mongoose');
const admin = mongoose.Schema({
    email: {type:String},
    password: {type:String},
    type: {type:String, default:"GENERAL"} // GENERAL, ROOT
});
module.exports = mongoose.model("admin",admin);
