require("dotenv").config();

const app = require('express')();
const cors = require('cors');
var http = require('http').Server(app);

const paymentRoute = require('./routes/paymentRoute');
app.use(cors('*'));
app.use('/',paymentRoute);

http.listen(3000, function(){
    console.log('Server is running');
});