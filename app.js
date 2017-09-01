//TODO:
// tests
// have registration and login
// allow you to create a snippet TODO: tags
// allow you to see a list of all your snippets for a specific tag


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

      res.render('register', {
                // errormessage: errormessage,
      });

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

      Users.find().then(function(data){
        //check with current usernames so that they remain unique
        for (let j = 0; j < data.length; j++){
          if (req.body.new_username === data[j].name){
            let errormessage = "username taken, please pick another name";
            res.redirect('/register');
            return;
          }
          if (req.body.new_username !== data[j].name){
            Users.create({
              name:req.body.new_username,
              password:req.body.new_password,
            });
            res.redirect('/home');
            return;
          }
        }
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
      let tags = [];
      tags.push(req.body.tags);

      console.log (tags);
      Snippets.create({
        title: req.body.title,
        code: req.body.code,
        notes: req.body.notes,
        language: req.body.language,
        tags: req.body.tags,
      });

      res.redirect('/add');
    });

    //search by language and tags
    server.post('/search', function(req, res){
        //the fields that are selected in the dropbox should //be used to specify which property the user wants to
        //search by.
        //if the value of the select is language,
        //find only those items and show them
        console.log(req.body.select);
        if (req.body.select === 'language'){
          Snippets.find({
            language: req.body.search_term
          }).then(function (snippets){

                res.render('home', {
                  snippets: snippets,
                });
            });
        }

        if (req.body.select === 'tags'){
          Snippets.find({
            tags: req.body.search_term
          }).then(function (snippets){

            // loop through the tags 

                res.render('home', {
                  snippets: snippets,
                });
            });
        }

     });


//open server
server.listen(5500, function(){
  console.log("Snip away on port 5500");
})
