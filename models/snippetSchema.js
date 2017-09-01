const mongoose = require('mongoose');

//TODO: is bluebird necessary?
mongoose.Promise = require('bluebird');


const snippetSchema = new mongoose.Schema({

  title: { type: String, required: true, unique: true},
  code: {type: String, required: true, unique: true},
  notes:{type: String, required: false, unique: false},
  language: {type: String, required: true, unique: false},
  tags: [String],
  // created_by : {type: String, required: true, unique:false}
});

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
