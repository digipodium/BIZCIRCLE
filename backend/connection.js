const mongoose = require('mongoose');

const url = 'mongodb+srv://Shreya123:123abc@cluster0.qquky8z.mongodb.net/mydb1408?appName=Cluster0'

//  asynchronous function returns a promise (a special object)
mongoose.connect(url)
.then((result) => {
    console.log('database connected');
})
.catch((err) => {
    console.log(err);
});

module.exports = mongoose;