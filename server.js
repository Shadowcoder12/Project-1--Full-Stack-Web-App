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
//get route / show new post form
app.get('/categories/new', (req, res) => {
  res.sendFile('/views/new_post.html', {root: __dirname});
});
//post route for new post form 
app.post('/categories/new', (req, res) => {
  let newPost = new db.Post({
    title: req.body.title,
    image: req.body.image,
    category: req.body.category,
    text: req.body.text,
    date: Date.now()
  });
  newPost.save((err, post) => {
    if (err) throw err;
    let redirectRoute = `/categories/${post._id}`
    res.redirect(redirectRoute);
  });
})
//route to show update post form
app.get('/categories/:id/edit', (req, res)=> {
  res.sendFile('/views/edit_post.html', {root: __dirname});
});

app.put('/categories/:id', (req, res)=> {
  console.log('req.body ',req.body)
  let redirectString = `/categories/${req.params.id}`;
  console.log('redirectString', redirectString);
  db.Post.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, post)=>{
    if(err) throw err
    console.log('updated post ', post);
    res.redirect(redirectString);
  });
});

//delete a post
app.get('/api/categories/:id/delete', (req, res) => {
  db.Post.findByIdAndDelete({_id: req.params.id}, (err, deleted) => {
    res.redirect('/categories')
  })
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
});







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


//adding comment 

app.post('/api/categories/:id', function (req, res) {

  const newComment = new db.Comment({

      text: req.body.text,
      author:req.body.author,
  });

      newComment.save((err,newComment)=>{
        if(err){throw err;}
        res.json(newComment);
      });
});









// =======================================================
// LISTEN
// =======================================================
app.listen(process.env.PORT || 3000, function () {
    console.log('Full Stack App listening at http://localhost:3000/');
  });
  