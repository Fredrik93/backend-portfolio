const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = 4000
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const userRoutes = express.Router()
let User = require('./user.model')
app.use('/users', userRoutes)

app.use(cors())
app.use(bodyParser.json())

var url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vojuh.mongodb.net/<dbname>?retryWrites=true&w=majority`;

var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});
var testUser = mongoose.model("testUser", nameSchema);



mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
//list of all users 
userRoutes.route('/').get(function (req, res) {
    testUser.find(function (err, users) {
        if (err) {
            console.log(err)
        } else {
            res.json(users)
        }
    })
})

//retrieve a specific user 
userRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    User.findById(id, function (err, user) {
        res.json(user)
    })
})

//create new entry
userRoutes.route('/add').post(function (req, res) {
    var myData = new testUser(req.body);
    myData.firstName = 'lola'
    myData.save()
        .then(item => {
            res.send(myData.firstName + "item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
})
//update user 
userRoutes.route('/update/:id').post(function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (!user) {
            res.status(404).send('Data not found')
        } else {
            user.name = req.body.name
            user.lastname = req.body.lastname
            user.experience = req.body.experience
            user.save().then(user => {
                res.json('User updated')
            })
                .catch(err => {
                    res.status(400).send('Update not possible')
                })
        }
    })
})

//update entry 
function update(experience) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myquery = { lastname: "Ullman" };
        var newvalues = { $set: { location: "Canyon 123", xp: experience } };
        dbo.collection("customers").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
}


const connection = mongoose.connection

connection.once('open', function () {
    console.log("mongodb db connection established")
})

//update(26)

app.listen(PORT, function () {
    console.log("Server is running on port 4000")
})