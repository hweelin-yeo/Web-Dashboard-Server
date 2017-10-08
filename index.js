var express = require('express');
var app = express();
var pg = require('pg'); // database


app.listen(process.env.PORT || 5000);

var Particle = require('particle-api-js');
var particle = new Particle();
var token;


// Login
particle.login({username: 'cornellresistance@gmail.com', password: 'clifford'}).then(
  function(data) {
    console.log('LOGGED IN.');
    token = data.body.access_token;
    console.log(token);
		getEventStream();
  },
  function (err) {
    console.log('Could not log in.', err);
  }
);

// Get event stream
function getEventStream() {
	//Successful login: get devices events
  console.log('Begin event stream.');
  console.log(token);
	particle.getEventStream({ deviceId: 'mine', auth: token }).then(function(stream) {
  stream.on('event', function(data) {

    console.log("Event: " + data);
    console.log(JSON.stringify(data, null, 4));
  });
});
}

// Database: Get all results
app.get('/db', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM data', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
         response.send({results: result.rows});}
         // response.render('pages/db', {results: result.rows} ); }
    });
  });
});

// Database: Post data
app.post('/add', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('INSERT INTO data (timestamp, property, value)' +
    'VALUES (NOW(), ${property}, $ {value})' [req.body.timestamp,
      req.body.property, req.body.value]); {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       {
         res.redirect('/db');}
         // response.render('pages/db', {results: result.rows} ); }
    });
  });
});


function createPuppy(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one puppy'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
