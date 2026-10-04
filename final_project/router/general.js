const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const result = {};
  for (const key in books) {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  }
  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found for author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const result = {};
  for (const key in books) {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  }
  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found for title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Axios promise / async-await client functions to retrieve books (Task 11)
const BASE_URL = 'http://localhost:5000';

function getAllBooks() {
  return axios.get(BASE_URL + '/').then((response) => response.data);
}

async function getBookByISBN(isbn) {
  const response = await axios.get(BASE_URL + '/isbn/' + isbn);
  return response.data;
}

async function getBooksByAuthor(author) {
  const response = await axios.get(BASE_URL + '/author/' + encodeURIComponent(author));
  return response.data;
}

async function getBooksByTitle(title) {
  const response = await axios.get(BASE_URL + '/title/' + encodeURIComponent(title));
  return response.data;
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
