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

// =======================================================
// STATIC HTML ROUTES
// =======================================================

//landing page
app.get('/', function (req, res) {
  res.sendFile('views/landing.html' , { root : __dirname});
});

app.get('/categories', (req, res) => {
  res.sendFile('/views/index.html', { root: __dirname});
})

//routes to serve category.html to different categories
app.get('/categories/music', (req ,res) => {
  res.sendFile('views/category.html' , { root : __dirname});
});
app.get('/categories/sports', (req, res) => {
  res.sendFile('views/category.html' , { root : __dirname});
});
app.get('/categories/food', (req ,res) => {
  res.sendFile('views/category.html' , { root : __dirname});
});
app.get('/categories/travel', (req, res) => {
  res.sendFile('views/category.html' , { root : __dirname});
});
app.get('/categories/animals', (req ,res) => {
  res.sendFile('views/category.html' , { root : __dirname});
});

// show html page for specific route
app.get('/categories/:id', (req, res) => {
  res.sendFile('views/post.html', {root: __dirname } );
})




// =======================================================
// API ROUTES
// =======================================================

//Get ALL posts
app.get('/api/categories', (req ,res) => {
    db.Post.find({}, (err, Posts) => {
      if (err) {
      console.log(err);
      }
      console.log(`Server route: ${Posts}`);
      res.json(Posts);
      });
  });

//Get a specific post
app.get('/api/categories/:id', (req, res) => {
  db.Post.findById(req.params.id, (err, post)=>{
    res.json(post);
  })
});




// =======================================================
// LISTEN
// =======================================================
app.listen(process.env.PORT || 3000, function () {
    console.log('Full Stack App listening at http://localhost:3000/');
  });
  