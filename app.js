require('dotenv').config();
var cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var satwaRouter = require('./routes/satwa');
var donasiRouter = require('./routes/donasi');
var userRouter = require('./routes/user');
var satwaDonasiRouter = require('./routes/satwaDonasi');
var satwaGambarRouter = require('./routes/satwaGambar');
var predictRouter = require('./routes/predict');
var transaksiRouter = require('./routes/transaksi');

var app = express();

let whitelist = ['http://localhost:3000', 'http://localhost', 'http://35.219.90.56:3000'];

app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // allow requests with no origin 
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var message = 'The CORS policy for this origin doesn\'t ' +
        'allow access from the particular origin.';
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
  exposedHeaders: ['set-cookie']
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/satwa', satwaRouter);
app.use('/donasi', donasiRouter);
app.use('/user', userRouter);
app.use('/satwa-donasi', satwaDonasiRouter);
app.use('/satwa-gambar', satwaGambarRouter);
app.use('/predict', predictRouter);
app.use('/transaksi', transaksiRouter);

module.exports = app;
