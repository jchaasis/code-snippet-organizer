//requirements
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//schemas for the snippets and users
const Snippets = require('./models/snippetSchema.js');
const Users = require('./models/userSchema.js')
//TODO: how do you use two different schemas? is ^^^ correct?

//establish server
const server = express();

//configure server
  //mustache
server.engine('mustache', mustache());
server.set('views', './views')
server.set('view engine', 'mustache');

  //bodyparser
server.use(bodyparser.urlencoded({ extended: false }));

  //sessions
  server.use(session({
      secret: 'Ÿ0üWî11ÑęvërGē+Thį$',
      resave: false,
      saveUninitialized: true
  }));

  //connect to database
    mongoose.connect('mongodb://localhost:27017/snippetCollection');

//establish routes

  //get
    //login page
    server.get('/login', function(req, res){
        res.render('login');
    });

    //registration page
    server.get('/register', function(req, res){
      res.render('register');
    });

    //home page
    server.get('/home', function(req, res){
      Snippets.find().then(function (snippets){
        res.render('home', {
            snippets: snippets,
        });
      });
    });

    //add snip page
    server.get('/add', function(req, res){
      res.render('add');
    });

  //post
    //new user
    server.post('/register', function(req, res){
      Users.create({
        name:req.body.new_username,
        password:req.body.new_password,
      });
    });

    //login
    server.post('/login', function(req, res){

      //create the variables that will be used for the session
      const username = req.body.username;
      const password = req.body.password;

      // let user = null;
      //find the users collection and convert to an array so we
      //can loop through it.

      let usersList = Users.find().then(function(data){
        let usersArr = data.toArray();
        console.log(usersArr);
      });

      console.log(usersList);

      res.redirect('/home');

    });

    //new Snippet
    server.post('/add', function(req, res){
      Snippets.create({
        title: req.body.title,
        code: req.body.code,
        notes: req.body.notes,
        language: req.body.language,
        tag: req.body.tags,
      });

      res.redirect('/add');
    });
//open server
server.listen(5500, function(){
  console.log("Snip away");
})
