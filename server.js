require('dotenv').config();

const express = require('express');
const app = express();
const port = 3200;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

/*** import routes ***/
const authRoute = require('./src/routes/auth.route');

mongoose.connect(process.env.URL_DB, { useNewUrlParser: true, useUnifiedTopology: true })

app.set('view engine', 'ejs');
app.set('view', './views');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

/*** use routes ***/
app.use('/auth', authRoute);

app.listen(port, () => console.log('Server is running...'));