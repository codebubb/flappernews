// Load mongoose library
var mongoose = require('mongoose');
// Create new schema
var CommentSchema = new mongoose.Schema({
  body: String, // The text of the comment
  author: String, // The person who wrote it
  upvotes: { type: Number, default: 0}, // Keep track of the upvotes
  post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

CommentSchema.methods.upvote = function(cb){
    this.save(cb);
    this.upvotes +=1;
  };


mongoose.model('Comment', CommentSchema);
