let path = require("path");
let express = require("express");
let morgan = require("morgan");
let body_parser = require('body-parser');
let mongoose = require('mongoose');
let pug = require('pug');
let session = require('express-session');
const port = 8000;

let app = express();

let router = require('./router/routes');

const log = console.log;

mongoose.connect("mongodb://localhost:27017/test", {
	useMongoClient : true,
});

mongoose.Promise = global.Promise;

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

// app.use(morgan("short"));

app.use(express.static(path.resolve(__dirname, "public")));

app.use(body_parser.urlencoded({"extended" : false}));

app.use(session({
	cookie: {
		maxAge: 60000 * 60,
	},
	secret: "learn-session",
	resave: true,
	saveUninitialized: true
}));

app.use(function(req, res, next) {
	if(req.session.currentUser) {
		res.locals.currentUser = req.session.currentUser;
	}
	res.locals.errors = [];
	res.locals.infos = [];
	next();
});

// mount the router to '/'
app.use(router);

app.listen(port);

log('server running on ' + port + '!');