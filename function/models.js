const mongoose = require('./db');

const DiscussionPost = mongoose.model('DiscussionPost', {
  title: String,
  content: String,
  likes: Number,
  comments: [{
    text: String,
  }],
});

module.exports = DiscussionPost;
