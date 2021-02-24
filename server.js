const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = express.Router();
const PORT = 4000;
require('dotenv').config()
var url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vojuh.mongodb.net/Timerdb?retryWrites=true&w=majority`;

let User = require('./user.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection up and running");
})

userRoutes.route('/').get(function (req, res) {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

userRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    User.findById(id, function (err, user) {
        res.json(user);
    });
});

// Update the XP of specific user 
userRoutes.route('/updatexp/:id').patch(function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (!user)
            res.status(404).send("data is not found");
        else
            user.experience = req.body.experience;
        user.save().then(user => {
            res.json('User experience updated!');
        })
            .catch(err => {
                res.status(400).send("Update  not possible at the moment");
            });
    });
});
//Update an entire user
userRoutes.route('/update/:id').post(function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (!user)
            res.status(404).send("data is not found");
        else
            user.name = req.body.name;
        user.lastname = req.body.lastname;
        user.experience = req.body.experience;
        user.save().then(user => {
            res.json('User updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

userRoutes.route('/add').post(function (req, res) {
    let user = new User(req.body);
    user.save()
        .then(user => {
            res.status(200).json({ 'user': 'User added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new user failed');
        });
});

app.use('/users', userRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});