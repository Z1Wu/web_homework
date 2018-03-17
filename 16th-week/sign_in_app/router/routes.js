const express = require("express");

const User = require("../models/user");
const log = console.log; 

let router = express.Router();


router.get('/login', function(req, res) {
	res.render('login');
});

router.get('/testDelete', function(req, res){
	User.deleteOne({username : 'z1wu'}, function(err, write) {
		if(err) {
			log(err);
		} else {
			showAllUser();
		}
		res.render('homePage');
	})
});

function showAllUser() {
	User.find({}, function(err, users) {
		log('show all user : \n', users);
	});
}

router.get('/showAll', function(req, res) {
	showAllUser();
	res.render('homePage');
});


router.post('/login', function(req, res) {
	log(req.body, req.body.username);
	User.findOne({
		username : req.body.username
	}, function(err, user) {
		if(!user) {
			res.locals.errors.push('No such user!!');
			res.render('login');
		} else {
			user.checkPassword(req.body.password, function(err, isMatch) {
				if(isMatch) {
					req.session.currentUser = user.username;
					res.locals.currentUser = user.username;
					res.locals.user = user;
					res.locals.infos.push('Successful login!!');
					res.render('showUser');
				} else {
					res.locals.errors.push('Wrong PassWord!!!');
					res.render('login');
				}
			});
		}
	});
});

router.get('/logout', function(req, res){
	req.session.currentUser = null;
	res.locals.currentUser = null;
	res.redirect('login');
});

router.get('/', function(req, res){
	if(req.query.username) {
		if(req.query.username == req.session.currentUser) {
			User.findOne({
				'username' : req.query.username
			}, function(err, user) {
				if(!err) {
					res.locals.user = user;
					res.render('showUser');					
				}
			});
		} else {
			res.locals.errors.push('Query Rejected!! No Access Permission!!');
			res.render('homePage');
		}
	} else if(req.session.currentUser) {
		User.findOne({
			'username' : req.session.currentUser 
		}, function(err, user) {
			if(!err) {
				res.locals.user = user;
				res.render('showUser');
			}
		});
	} else {
		res.render('login');
	}
});

router.get('/checkRepeat', function(req, res) {
	log('has in checkRepeart ', req.query);
	User.findOne(req.query, function(err, user) {
			if(user) {
				log('conflict', user);
				return res.json({isRepeat : true});
			} else {
				return res.json({isRepeat : false});
			}
		}
	);
});

router.get('/regist', function(req, res, next) {
	res.render('regist');
});

router.post('/regist', function(req, res) {
	let newUser = new User({
		username : req.body.username,
		password : req.body.password,
		email : req.body.email,
		phone : req.body.phone,
		studentNumber : req.body.studentNumber
	});
	log(newUser);
	newUser.save(function (err) {
		if(err) {
			log(err);
		}
	});
	res.locals.infos.push('Successfully regist!');
	res.render('homePage');
});

module.exports = router;