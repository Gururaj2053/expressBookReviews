const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
    let password = req.body.password;
    if(username && password){
        if(!isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message: `User ${username} successfully registered. Now you can login!`})
        } else{
            return res.status(404).json({message:"User already exists!"});
        }
    }
    return res.status(404).json({message:"Unable to register user.Please try again."})
});

// Get the book list available in the shop
public_users.get('/',async  function (req, res) {
  let book_list = await Promise.resolve(books)
  return res.status(300).json({message: 'Here is the list of all the books', book_list});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  let isbn =  req.params.isbn;
  let req_book = await Promise.resolve(books[isbn]);
  return res.status(300).json({message: "Requested book details", req_book });
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  let author = req.params.author;
  let req_book = await Object.values(books).filter((user)=>{ return (user.author.toLowerCase() === author.toLowerCase()) });
  return res.status(300).json({message: "Requested book details",req_book});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  let title = req.params.title;
  let req_book = await Promise.resolve(Object.values(books).filter((user)=>{ return user.title.toLowerCase() === title.toLowerCase()}));
  return res.status(300).json({message: "Requested book details",req_book});
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  let isbn = req.params.isbn;
  let req_book_review = await Promise.resolve(books[isbn].reviews);
  return res.status(300).json({message: "Requested book reviews written by authenticated users", req_book_review});
});

module.exports.general = public_users;
