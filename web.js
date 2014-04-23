var logger = require('morgan');
var express = require('express');
var compress = require('compression')();
var app = express();

app.use(express.static(__dirname + '/dist', { maxAge: 0 }));
app.use(logger());
app.use(compress);
app.listen(process.env.PORT || 5000);
console.log("Listening on port: " + (process.env.PORT || 5000));