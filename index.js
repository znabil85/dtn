const express = require('express');
const app = express();
const port = 4000;

// import routes
const inputRoute = require('./routes/GetInput.js')

app.get('/', function(req, res) {
    res.send('Hello');
});
app.use('/', inputRoute);
app.get('*', (req, res) => {
    //res.status(404).send('Not found');
    res.redirect('/');
})

app.listen(port, () => {
    console.log('app is running');
});