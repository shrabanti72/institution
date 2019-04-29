var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var InstitutionSchema = new mongoose.Schema({
    name: String,
    location : String
});

InstitutionSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Institution", InstitutionSchema);