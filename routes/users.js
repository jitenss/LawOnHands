var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var value;

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}

// About
router.get('/about', function(req, res){
	res.render('about');
});

// Mail
router.get('/mail', function(req, res){
	res.render('mail');
});

// forum
router.get('/forum', function(req, res){
	res.render('forum');
});

router.get('/dashboard', ensureAuthenticated, function(req, res) {
		// var user_level = req.body.user_level; 	
		if (value== 'Lawyer') {
			console.log(value);
			res.redirect('/users/dashboardl');
		} else if (value== 'Client') {
			console.log(value);
			res.redirect('/users/dashboardc');
		} else {
			console.log('hello');
			res.redirect('/');
			failureFlash: true;
		}
  });


// Dashboard client
router.get('/dashboardc', ensureAuthenticated, function(req, res){
	res.render('dashboardc', {layout: 'layoutb.handlebars'});
});

// Dashboard lawyer
router.get('/dashboardl', ensureAuthenticated, function(req, res){
	res.render('dashboardl', {layout: 'layoutb.handlebars'});
});

// // Register
// router.get('/register', function(req, res){
// 	res.render('register');
// });

// Login
router.get('/login', function(req, res){
	console.log("sdfasf");
	res.redirect('index');
});

//Register
router.get('register', function(req, res){
	res.redirect('/');
	res.render('index');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	var user_level = req.body.user_level;
	console.log("%s %s %s",name, email, password);
	// Validation
	req.checkBody('name', 'name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('user_level', 'UserLevel is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		req.flash('failure-msg', 'Registration Failed : Passwords were not matching');
		res.render('index',{
			errors:errors
		});
		console.log(errors);
	} else {
		// //User already registered
		User.getUserByEmail(email, function(err, user){
			if(err) throw err;

			if(user){
				 req.flash('failure-msg', 'The Email Id is already registered');
				console.log("FAILURE");
				res.redirect('/');
			}
		});
		var newUser = new User({
			name: name,
			email: email,
			password: password,
			user_level: user_level
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');
		res.redirect('/');
	}
});

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
  },
  function(username, password, done) {
   User.getUserByEmail(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// router.post('/login',
//   passport.authenticate('local', {successRedirect:'/', failureRedirect:'/',failureFlash: true}),
//   function(req, res) {
//   	console.log(req.body);
//     res.redirect('/');
//   });

router.post('/login',
	passport.authenticate('local', { failureRedirect:'/',failureFlash: true}),
	function(req, res) {
		value = req.body.user_level;
		console.log(value);
		// var user_level = req.body.user_level; 
		if (value== 'Lawyer') {
			req.flash('success_msg', 'You are logged in as Lawyer');
			res.redirect('/users/dashboardl');
		} else if (value== 'Client') {
			req.flash('success_msg', 'You are logged in as a Client');
			res.redirect('/users/dashboardc');
		} else {
			res.redirect('/');
			failureFlash: true;
		}
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});

router.get('/submit', ensureAuthenticated, function(req, res){
	req.flash('success_msg', 'Form submitted succesfully');

	res.redirect('/users/dashboardc');
});

router.post('/search', ensureAuthenticated, function(req, res){
	var name = req.body.lname;
	console.log(name);
	User.getUserByUsername(name, function(err, result){
		if(err)	throw err;
		res.render('search', {
			layout: 'layoutb.handlebars',
			result : result
		});
	});
});

router.get('/searchlawyer',ensureAuthenticated, function(req, res){
	res.render('searchlawyer', {layout: 'layoutb.handlebars'});
});

router.get('/divorcecase',ensureAuthenticated,function(req, res){
	res.render('divorcecase', {layout: 'layoutb.handlebars'});
});

router.get('/criminalcase',ensureAuthenticated,function(req, res){
	res.render('criminal', {layout: 'layoutb.handlebars'});
});

router.get('/corporatecase',ensureAuthenticated,function(req, res){
	res.render('corporatecase', {layout: 'layoutb.handlebars'});
});

module.exports = router;
