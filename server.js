/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
// generate a new express app and call it 'app'
const app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));



// define a root route: localhost:3000/
app.get('/', function (req, res) {
    res.sendFile('views/index.html' , { root : __dirname});
  });

// SHOW ALL THE WISHES
app.get('/categories', (req ,res) => {
  
    db.Post.find({}, (err, Posts) => {
      if (err) {
      console.log(err);
      }
      console.log(`Server route: ${Posts}`);
      res.json(Posts);
      });
  })






app.listen(process.env.PORT || 3000, function () {
    console.log('Full Stack App listening at http://localhost:3000/');
  });
  