
var express      = require('express');
var app          = express();
var MongoClient = require('mongodb').MongoClient; // Connect to the db 
var mongo = require('mongodb');




app.set('port', (process.env.PORT || 5000));

var bookingDatbase = process.env.DATABASE_URL
//view_all_booking
app.get('/view_all_booking', (req, res) => {
  MongoClient.connect(bookingDatbase, function(err, db) { 
  if(err) { 
    return console.dir(err); 
  } 

  db.collection('liger_booking').find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
      db.close();
  }); 
});
});

///new/booking
app.get('/new/booking', function(req, res) {
  var status = req.query.status;
  var driver = req.query.driver;
  var date = req.query.date;
  var from = req.query.from;
  var to = req.query.to;
  var customer = req.query.customer;

  var objOne = { 
    status: status,
    driver: driver,
    date: date,
    from: from,
    to: to,
    customer: customer 
  };

  res.send(objOne)

  MongoClient.connect(bookingDatbase,function(err, db){
    if(err) throw err;
    db.collection('liger_booking').insertOne(objOne, function(err, res){
      if(err) throw err;
      console.log("Inserted");
      db.close();
    });
  });
});

app.get('/update/booking', function(req, res){
  //'/update/booking?id=sdfsdfd&driver=visal&status=new'

  var comparison = {
    _id : new mongo.ObjectID(req.query.id)
  };

  var objOne = {
    $set: {
      driver: req.query.driver,
      status: req.query.status
    }
  };

  MongoClient.connect(bookingDatbase, function(err, db){
    if(err) throw err;
    db.collection('liger_booking').update(comparison, objOne, function(err, res){
      if(err) throw err;
      console.log("Updated");
      db.close();
    });
  });
  // res.send(objOne);
});





app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.use(express.static('public/'));