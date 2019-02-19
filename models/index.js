const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/postLee", {useMongoClient: true});


module.exports.Post = require('./post.js');
module.exports.Comment = require('./comment.js');