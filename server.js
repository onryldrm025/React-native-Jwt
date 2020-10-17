const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

const con = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'db',
});

const server = app.listen(4545, function () {
  const host = server.address().address;
  const port = server.address().address;
});

con.connect(function (eror) {
  if (eror) {
    console.log(eror);
  } else {
    console.log('connected');
  }
});

app.get('/users', function (req, res) {
  con.query('select * from users', function (error, rows, fields) {
    if (error) {
      console.log(error);
    } else {
      res.send(rows);
      res.end();
    }
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      console.log('Token Geçersiz');
      res.sendStatus(403);
    } else {
      console.log(authData.user.username);
      console.log(authData.user.email);
      console.log(authData.user.meslek);
      res.json({
        message: 'Post created...',
        authData,
      });
    }
  });
});

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers.authorization;
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Badrequest
    console.log('header Yok');
    res.sendStatus(400);
  }
}

app.post('/kaydol', function (req, res) {
  console.log(req.body.name);
  const user = {
    username: req.body.name,
    email: req.body.email,
    meslek: req.body.meslek,
  };
  jwt.sign({user}, 'secretkey', {expiresIn: '60s'}, (err, token) => {
    res.json({
      token,
      status: true,
    });
  });

  const sql = 'INSERT INTO users (id, ad, soyad, meslek) VALUES ?';
  const values = [['NULL', req.body.name, req.body.email, req.body.meslek]];
  con.query(sql, [values], function (error, rows, fields) {
    if (error) {
      console.log(error);
    } else {
    }
  });
});
