var thunder = {};

//----------------------------------------------------------------------
// Require
//----------------------------------------------------------------------

var express = require('express');
var mongoose = require('mongoose');

//----------------------------------------------------------------------

thunder.config = require('./config');

thunder.express = express();
thunder.express.use(express.bodyParser());

thunder.express.get('*', function (req, res) {
  res.send('test');
})