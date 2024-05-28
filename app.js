const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// Updated MongoDB connection string to connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/blogdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postsSchema = ({
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  postcontent: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

const app = express();

const Post = mongoose.model("Post", postsSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    res.render("index", {
      newPosts: foundPosts.reverse()
    });
  });
})

app.get("/posts/:postId", function(req, res) {
  const postIdValue = req.params.postId;
  Post.findOne({_id: postIdValue}, function(err, foundPosts) {
    if (err) {
      res.render("404");
    } else {
      res.render("post", {post: foundPosts});
    }
  });
})

app.get("/login", function(req, res) {
  res.render("login")
})

app.post("/login", function(req, res) {
  const authKey = ""; // place your auth key here for your blog :D
  if (req.body.token == authKey) {
    res.render("createPost");;
  } else {
    res.render("index");
  }
})

app.post("/createPost", function(req, res) {
  const userName = req.body.username;
  const title = req.body.postTitle;
  const content = req.body.postcontent;
  const filename = req.body.filename;
  console.log(filename);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  let newPost = new Post({
    username: userName,
    title: title,
    postcontent: content,
    date: today
  });

  newPost.save();
  Post.find({}, function(err, foundPosts) {
    res.render("index", {
      newPosts: foundPosts.reverse()
    });
  });
})

app.get("*", function(req, res){
  res.render("404");
})

app.listen(4000, function() {
  console.log("Hosted on port 4000");
})
