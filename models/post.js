const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema ({
    title: String,
    category: String,
    image: String,
    date: String,
    comment: [Comment.schema]
    });


    const Post = mongoose.model('Post', PostSchema);
    module.exports = Post;