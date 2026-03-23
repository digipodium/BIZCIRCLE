const express = require('express');
const UserRouter = require('./routers/UserRouter');
const GroupRouter = require('./routers/GroupRouter');

const app = express();

const port = 5000;

// middleware
app.use(express.json());
app.use('/user', UserRouter);
app.use('/group', GroupRouter);

// route or endpoint
app.get('/', (req, res) => {
    res.send('response from server');
});

app.get('/add', (req, res) => {
    res.send('response from add');
});

// getall
// delete
// update

app.listen(port, () => {
    console.log('server started');
});