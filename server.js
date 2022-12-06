const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const db = require('./models');

app.use(bodyParser.json());

app.use('/users', require('./routes/user'));
app.use('/vehicles', require('./routes/vehicle'));

db.sequelize
    .sync()
    .then(() => {
        console.log('Connected to DB');
        app.listen(3000, () => console.log('Server listening to PORT 3000'))
    })
    .catch(err => {
        console.error(err);
    })