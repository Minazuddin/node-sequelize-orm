require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { generateJwkSet } = require('./utils/helper');
const app = express();
// const db = require('./models');
const jwksRoutes = require('./routes/jwks');
const userRoutes = require('./routes/user');
const vehicleRoutes = require('./routes/vehicle');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(morgan('tiny'))

app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000']
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use('/jwks', jwksRoutes);
app.use('/user', userRoutes);
app.use('/vehicle', vehicleRoutes);

console.log('Connected to DB');

app.listen(PORT, () => {
    generateJwkSet();
    console.log(`Server listening to PORT ${PORT}`)
})

// db.sequelize
//     .sync()
//     .then(() => {
//         console.log('Connected to DB');
//         app.listen(3000, () => console.log('Server listening to PORT 3000'))
//     })
//     .catch(err => {
//         console.error(err);
//     })