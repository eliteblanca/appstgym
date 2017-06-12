var express = require('express'),
    app = express(),
	morgan = require("morgan"),
	mongoose = require("mongoose"),
	path = require('path'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	q = require('q'),
	moment = require('moment');

mongoose.Promise = q.Promise;
app.set('port',(process.env.PORT || 5000));
mongoose.connect('mongodb://eliteblanca:julianvar1@ds149049.mlab.com:49049/hello');

process.on("SIGINT",function(){
	mongoose.connection.close(function(){
		console.log("Mongoose disconected through app termination");
		
	});
});

mongoose.connection.on("error",function(err){
	console.log("Mongoose connection error: " + err);
	process.exit();
});

mongoose.connection.on("connected",function(){
	console.log("Mongoose connected to mongodb://localhost/myapp");
});

mongoose.connection.on("disconnected",function(err){
	console.log("Mongoose disconnected " + err);
	process.exit();
});

app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(cookieParser());
var publicPath = path.resolve(__dirname,"public");
app.use(express.static(publicPath));

app.use(require("./routers"));

app.get('/', function(req, res){
    res.sendFile('landingPage.html', { root: __dirname + "/public/views" } );
});


app.listen(app.get('port'),function(){
	console.log('server litening on port ' + app.get('port'));
});

