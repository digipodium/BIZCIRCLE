require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGO_URI;

//  asynchronous function returns a promise (a special object)
mongoose.connect(url)
 .then((result) => {
    console.log('database connected');
})
.catch((err) => {
    console.log(err);
});

module.exports = mongoose;