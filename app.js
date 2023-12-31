const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('./function/db');
const addRoute = require('./function/add');
const postsRoute = require('./function/posts');
const methodOverride = require('method-override');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride('_method'));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Add - Function
app.use('/', addRoute);

// Post - Function
app.use('/', postsRoute);



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
