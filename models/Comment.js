var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: { type: Number, default: 0},
  post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

CommentSchema.methods.upvote = function(cb){
    this.save(cb);
    this.upvotes +=1;
  };


mongoose.model('Comment', CommentSchema);
