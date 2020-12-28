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

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
//list of all users 
userRoutes.route('/').get(function (req, res) {
    User.find(function (err, users) {
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
    let user = new User(req.body)

    user.save()
        .then(user => {
            res.status(200).json({ 'user': 'user added successfully' })
        })
        .catch(err => {
            res.status(400).send('Adding new user failed')
        })
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