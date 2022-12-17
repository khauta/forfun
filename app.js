var express = require('express');
var cors = require('cors');
const uRt = require('./api/sms/sms.router');


// creating the app instance
var app = express();
//app.set('view engine', 'ejs');   for setting node tempplate engine


// cors addition
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// setting express to use json
app.use(express.json());

// just to veryfiy server is running
app.get('/', (req, res) => {
  res.json({ 'message': 'ok' });
})

//handing over user related route to the their router module
app.post('/', (req, res) => {
    console.log(req.query);
    res.json({ 'message': `${req.body}` });
  })

//handing over user related route to the their router module
app.post('/api/sms', uRt)


app.listen(2020);
console.log('Listening on port 2020');