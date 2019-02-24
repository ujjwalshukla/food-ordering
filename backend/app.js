var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const exjwt = require('express-jwt')

var routes = require('./routes/index');
var users  = require('./routes/users');
var auth  = require('./routes/auth');
var restaurant  = require('./routes/restaurant');
var orders  = require('./routes/orders');
const shareOrder = require('./routes/shareOrders');

require('./helper/redis');
var app = express();
// var cors = require('cors');

// Requiring our models for syncing
var db = require("./models");

// app.use(cors({ origin: '*' }));
// Settings for CORS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Pass to next layer of middleware
    next();
});

/*========= Here we want to let the server know that we should expect and allow a header with the content-type of 'Authorization' ============*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const jwtMW = exjwt({
  secret: 'super secret'
});

app.use('/api/auth', auth);

// app.use('/restaurant/:restaurantId/items', restaurantItems);
app.use('/api/restaurant', jwtMW, restaurant);

// app.use('/orders/shared', sharedOrders);
app.use('/api/orders', jwtMW, orders);
app.use('/api/share/orders', jwtMW, shareOrder);

// app.use('/users', jwtMW, users);


// app.get('/', jwtMW, (req, res) => {
//   console.log("Web Token Checked.");
//   res.send('You are authenticated'); //Sending some response when authenticated
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  console.log(err)
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});


var models = require("./models");

//Sync Database
models.sequelize.sync().then(function() {

    console.log('Nice! Database looks fine')

}).catch(function(err) {

    console.log(err, "Something went wrong with the Database Update!")

});

module.exports = app;
