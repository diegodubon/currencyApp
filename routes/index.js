var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let isConnected = false;

//passport authentication
var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var auth = require('../authentication/auth.js');



//db connection
// const dbConfig = require('../db.config.json').mlab;
let stringConnection = 'mongodb://devddubon:Callejero_1@ds225078.mlab.com:25078/currencyexchangedb';

mongoose.connect(stringConnection);

let db;
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', function () {
  // console.log(`Connection established to => ${stringConnection}`);
  console.log(`Connection established`);
  db = mongoose.connection;

  isConnected = true;
});
//Handling errors
mongoose.connection.on('error', function () {
  console.log('Could not connect to MongoDB');
});

mongoose.connection.on('disconnected', function () {
  console.log('Lost MongoDB connection...');
  if (!isConnected) {
    db = mongoose.connect(stringConnection);
  }
});

mongoose.connection.on('reconnected', function () {
  console.log('Reconnected to MongoDB');
});

passport.use(
  new Strategy(function (username, password, cb) {
    auth.findByUsername(
      username,
      function (err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }
        if (user.api_secret != password) {
          return cb(null, false);
        }
        return cb(null, user);
      },
      db
    );
  })
);
let currencyDb = require("../currencyDb.json");
let currencyApi = require("../currencyApi");

// insert for documents
// router.get('/insert', (req, res) => {
//   db.collection("currency").insertMany(currencyDb)
//     .then(response => console.log(response))
//     .catch(err => console.log(err))
// })

router.get('/', function (req, res) {
  res.render("index", { title: "Currency Exchage rate Api" })
})

router.get('/latest/:currency1-:currency2', passport.authenticate('basic', { session: false }), function (req, res) {
  let currency1 = req.params.currency1;
  let currency2 = req.params.currency2;

  let params = {
    currency1,
    currency2
  }
  currencyApi.main2(db, params, (result) => {
    if (result == null) {
      res.json({ message: "Not data found" })
    } else {
      res.json(result);
    }
  })

})

router.get('/getCurrencies', async function (req, res) {
  try {
    let lastDate = await currencyApi.getLastDate(db);
    let currencies = await currencyApi.getCurrencies(db, lastDate);

    res.status(200).json(currencies);

  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }

})
router.get(
  '/latest/:currency',
  passport.authenticate('basic', { session: false }),
  function (req, res) {

    let currency = req.params.currency;
    let result = currencyApi.main(db, currency, (result) => {
      if (result == null) {
        res.json({ message: "Data not found" })
      } else {
        res.json(result);
      }

      // res.jsonp(result);
    });
  }
);

router.get('/historical/:currency1-:currency2', function (req, res) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;

  let currency1 = req.params.currency1;
  let currency2 = req.params.currency2;

  // console.log(startDate, endDate);
  let params = { startDate, endDate, currency1, currency2 }

  currencyApi.getCurrencyByDateRange(db, params)
    .then(result => res.send(result))
    .catch(err => res.send(err))
})

router.get('/historical/:currency1-:currency2/:date', function (req, res) {
  let currency1 = req.params.currency1;
  let currency2 = req.params.currency2;
  let date = req.params.date;

  console.log(currency1);
  let params = {
    currency1,
    currency2,
    date
  }

  let result = currencyApi.getCurrencyByDate(db, params, (result) => {
    res.send(result);
  })
})

module.exports = router;
