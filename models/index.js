const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/postLee",{ useNewUrlParser: true });



module.exports.Post = require('./post.js');
module.exports.Comment = require('./comment.js');