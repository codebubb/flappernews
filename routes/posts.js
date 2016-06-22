var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

router.get('/', function(req, res, next){
  
});

module.export = router;
