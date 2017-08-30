//TODO:have a comprehensive set of tests for all controllers and models
// have registration and login
// allow you to create a snippet
// allow you to see a list of all your snippets
// allow you to see a list of all your snippets for a specific language
// allow you to see a list of all your snippets for a specific tag
// allow you to look at an individual snippet


//requirements
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session'); //TODO: Do We even need sessions?

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
            // name: user,
        });
      });
    });


    //code display page
    server.get('/display/:snippet_id', function(req, res){

          const id =  req.params.snippet_id; // the _id is mongo specific

          Snippets.findOne({
            _id: id
          }).then(function(results){

            res.render('display', {
                snippet: results, //result from the database
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

      let user = null;
      //find the users in the Users collection so that we can //iterate through and check the given username with the users //in the database

        Users.find().then(function(data){
          for (let i = 0; i < data.length; i++){

            if (data[i].name === username &&
               data[i].password === password){

                 user = data[i].name;
            }
          }
          //if the user info matches then we set up their session
          // and send them to the home screen
          if (user !== null){
            req.session.who = user;
            res.redirect('/home');
          } else {
            res.redirect('/login');
          }

        });
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

    //search by language and tags
    server.post('/search', function(req, res){
        //the fields that are selected in the dropbox should //be used to specify which property the user wants to
        //search by.
        console.log(req.body.search_term);
        //if the value of the select is language,
        //find only those items and show them
        Snippets.find({
          language: req.body.search_term
        }).then(function (snippets){

              console.log(snippets);

              console.log(Snippets.language);

              res.render('home', {
                snippets: snippets,
              });
          });

     });


//open server
server.listen(5500, function(){
  console.log("Snip away on port 5500");
})
