const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"Gururaj","password":"pwd123"}];

const isValid = (username)=>{
  let userwithsamename = users.filter((user)=>{
    return user.username === username;
})
if (userwithsamename.length >0){
    return true;
} else{
    return false;
}
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(!username||!password){
      return res.status(404).json({message:"Error logging in"});
    }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: password},
      'access',{expiresIn: 60*60});
        
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } 
    else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.session.username;
  let review = req.body.review;
  let isbn = req.params.isbn;
  if (review){
    if(books[isbn].reviews.username){ 
      books[isbn].reviews = {"username":"review"}
      return res.status(300).json({message: "Your latest has review has been updated."});
    }
    books[isbn].reviews = {"username":"review"}
    return res.status(300).json({message: "Your review has been added.Thank you"});
  }
});

regd_users.delete("/auth/delete/review/:isbn",(req,res)=>{
  isbn = req.params.isbn;
  delete books[isbn].reviews.username;
  return res.status(300).json({message: "Your review has been deleted."})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
