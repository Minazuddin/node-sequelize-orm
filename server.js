require('dotenv').config();
const express = require('express');
const { generateToken } = require('./utils/middleware');
const app = express();
// const db = require('./models');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/user', require('./routes/user'));
app.use('/vehicle', require('./routes/vehicle'));

console.log('Connected to DB');
app.listen(PORT, () => console.log(`Server listening to PORT ${PORT}`))

// db.sequelize
//     .sync()
//     .then(() => {
//         console.log('Connected to DB');
//         app.listen(3000, () => console.log('Server listening to PORT 3000'))
//     })
//     .catch(err => {
//         console.error(err);
//     })