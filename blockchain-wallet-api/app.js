'use strict'

/*
  import file
*/
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const timeout       = require('connect-timeout');

const bitcoinRouter     = require('./api/routes/bitcoin');
const bitcoinCashRouter = require('./api/routes/bitcoinCash')
const litecoinRouter    = require('./api/routes/litecoin');
const zCashRouter       = require('./api/routes/zCash');
const rippleRouter      = require('./api/routes/ripple');
const ethereumRouter    = require('./api/routes/ethereum');

const authentication  = require('./api/middleware/authentication');

const app = express();

app.use(timeout(120000));
app.use(haltOnTimedout);
app.use(cookieParser())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
  set CORS-header
*/
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
  basic authentication
*/

app.use(authentication.authentication)

/*
  general routes
*/

app.use('/BCH', bitcoinCashRouter)

app.use('/BTC', bitcoinRouter)

app.use('/ZEC', zCashRouter)

app.use('/LTC', litecoinRouter)

app.use('/ETH', ethereumRouter)

app.use('/XRP', rippleRouter)


// error page handler
app.use(function (req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
})
  //Handling error
app.use((req, res, next) =>{
  	const error = new Error('Not found');
  	error.status = 404
  	next(error);
})


app.use((error, rep, res, next) =>{
  	res.status(error.status || 500);
  	res.json({
  		error: {
  			message: error.message
  		}
  	});
});

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
  else {
    res.status(501).json({
      status : "fail",
      message : "time out"
    })
  }
}

module.exports = app;

