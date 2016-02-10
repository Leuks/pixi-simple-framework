var http = require('http');

var express = require('express');

var app = express();


app.set('views', __dirname + '/views');
app.set('view engine','ejs');

app.use('/static',express.static(__dirname + '/static'));
app.use('/lib',express.static(__dirname + '/../bin'));

app.get('/', function(req, res) {
    res.render("index", {});    
});


app.listen(8080);





