var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]

});

PostSchema.methods.upvote = function(cb){
    this.save(cb);
    this.upvotes +=1;
  };


mongoose.model('Post', PostSchema);
