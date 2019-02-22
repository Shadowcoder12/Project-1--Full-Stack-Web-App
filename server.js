//require express in our app
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user');
const db = require('./models');
// const scrp = require('./public/scripts');
// generate a new express app and call it 'app'
const app = express();

// serve static files in public
app.use(express.static('public'));

app.use(require('express-session')({
secret:"Bella is the best dog in the world",
resave:false,
saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

// =======================================================
// STATIC HTML ROUTES
// =======================================================

//landing page
app.get('/', function (req, res) {
  res.sendFile('views/landing.html' , { root : __dirname});
});

app.get('/categories',isLoggedIn, (req, res) => {
  res.sendFile('/views/index.html', { root: __dirname});
})
//get route / show new post form
app.get('/categories/new', isLoggedIn, (req, res) => {
  res.sendFile('/views/new_post.html', {root: __dirname});
});
//post route for new post form 
app.post('/categories/new', (req, res) => {
  let newPost = new db.Post({
    title: req.body.title,
    image: req.body.image,
    category: req.body.category,
    text: req.body.text,
    author: req.user.username,
    date: Date.now()
  });
  newPost.save((err, post) => {
    if (err) throw err;
    let redirectRoute = `/categories/${post._id}`
    res.redirect(redirectRoute);
  });
})
//route to show update post form
app.get('/categories/:id/edit', isLoggedIn, (req, res)=> {
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
app.get('/api/categories/:id/delete', isLoggedIn, (req, res) => {
  db.Post.findByIdAndDelete({_id: req.params.id}, (err, deleted) => {
    res.redirect('/categories')
  })
})


//routes to serve category.html to different categories
app.get('/categories/music', isLoggedIn , (req ,res) => {
  res.sendFile('views/category.html' , { root : __dirname});
});
app.get('/categories/sports', isLoggedIn, (req, res) => {
  res.sendFile('views/category.html' , { root : __dirname});
});
app.get('/categories/food', isLoggedIn , (req ,res) => {
  res.sendFile('views/category.html' , { root : __dirname});
});
app.get('/categories/travel', isLoggedIn, (req, res) => {
  res.sendFile('views/category.html' , { root : __dirname});
});
app.get('/categories/animals', isLoggedIn , (req ,res) => {
  res.sendFile('views/category.html' , { root : __dirname});
});
// show html page for specific route
app.get('/categories/:id', isLoggedIn , (req, res) => {
  res.sendFile('views/post.html', {root: __dirname } );
});

// =======================================================
// AUTH ROUTES
// =======================================================


app.get('/comments',isLoggedIn, (req ,res) => {

  res.sendFile('views/comments.html' , { root : __dirname});
});

// sends user to the register forum
app.get('/register', (req, res) => {
  res.sendFile('views/register.html', {root: __dirname } );
});


// password is hashed for user protection 
app.post('/register', (req, res) =>{
    req.body.username
    req.body.password
    // grabbing the user data and ONLY storing the username in the DB
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if (err) {
        console.log(err);
        return res.render('register');
      }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/");
      });
    });
});
// =======================================================
// LOGIN ROUTES
// =======================================================
// render login form
app.get('/login', (req, res) => {
  res.sendFile('views/Login.html', {root: __dirname } );
});
// login logic: checking to see if the credentials match the db, if not user is sent back to the login page
app.post('/login',passport.authenticate('local', {
  successRedirect:'/categories',
  failureRedirect:"/login"
}) ,(req, res)=> {

});

// =======================================================
// LOGOUT ROUTES
// =======================================================
app.get('/logout', (req, res)=> {
  req.logout();
  res.redirect("/");
});

// function that checks to see if the user is logged in , if not. user is redirected to the home page
// this function will be used at each route to check for auth
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}


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



// displaying all comments
app.get('/api/comments', (req, res) => {
  db.Comment.find((err, foundComments)=>{
      if(err){
        console.log("Index Error: " + err)
        res.sendStatus(500);
      }
      res.json(foundComments);
  });
});



//adding comments 
app.post('/api/comments', function (req, res) {

  let newComment = new db.Comment({
    
      text: req.body.text,
      author:req.body.author,
  });
    
      newComment.save((err,newComment)=>{
        if(err){throw err;}
        res.json(newComment);
      });
});


// updating comments 
app.put('/api/comments/:id', (req, res) => {
  let commentId = req.params.id;
  db.Comment.findOneAndUpdate({ _id: commentId }, req.body, {new: true})
    .exec((err, updatedComment)=> {
      res.json(updatedComment);
  });
});
  

// deleting comments 
app.delete('/api/comments/:id', function (req, res) {
  const commentId = req.params.id;

  db.Comment.findOneAndDelete({_id: commentId},(err,deletedComment)=>{
    if (err) {throw err;}
    res.json(deletedComment);
  });

});

// =======================================================
// LISTEN
// =======================================================
app.listen(process.env.PORT || 3000, function () {
    console.log('Full Stack App listening at http://localhost:3000/');
  });
  
