const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const port = 5000;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.sjfoa.mongodb.net:27017,cluster0-shard-00-01.sjfoa.mongodb.net:27017,cluster0-shard-00-02.sjfoa.mongodb.net:27017/Volunteer?ssl=true&replicaSet=atlas-43pj5u-shard-0&authSource=admin&retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology : true });


client.connect(err => {
  const collection = client.db(`${process.env.DB_DATABASE}`).collection(`${process.env.DB_COLLECTION}`);
  const userCollection = client.db(`${process.env.DB_DATABASE}`).collection(`${process.env.DB_COLLECTION2}`);
   app.get('/products',(req,res) =>{
     collection.find({})
     .toArray((err,document) =>{
       res.send(document);
     })
   })

   app.post("/addUser", (req, res) => {
    const user = req.body;
    userCollection.insertOne(user)
    .then(result => {
      res.redirect('http://localhost:3000/eventtasks')
    })
  })

  app.get('/userEvents',(req,res) =>{
    userCollection.find({email : req.query.email})
    .toArray((err,document) =>{
      res.send(document);
    })
  })

  app.get('/allUserEvents',(req,res) =>{
    userCollection.find({})
    .toArray((err,document) =>{
      res.send(document);
    })
  })


  app.delete('/delete/:id', (req, res) =>{
    userCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })
});




app.listen(process.env.PORT || port)