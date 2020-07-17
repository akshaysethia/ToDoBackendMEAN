const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config();
const passport = require('passport');
require('./config/passport-setup');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (!err) {
        console.log('Connected to MongoDB !');
    } else {
        console.log('An Error Occured', err);
    }
});

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/Angular')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/todo', todoRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server running on Port: http://localhost:${process.env.PORT}`);
});