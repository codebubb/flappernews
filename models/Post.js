// Load the mongoose library
var mongoose = require('mongoose');
// The post schema
var PostSchema = new mongoose.Schema({
  title: String, // Title of the post
  link: String, // Optional link for the article
  author: String, // Who wrote it
  upvotes: {type: Number, default: 0}, // Keep track of upvotes for the post
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]

});

PostSchema.methods.upvote = function(cb){
    this.save(cb);
    this.upvotes +=1;
  };


mongoose.model('Post', PostSchema);
