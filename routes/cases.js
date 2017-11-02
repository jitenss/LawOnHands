var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Case = require('../models/case');

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}



//Client Divorce case
router.post('/submit',function(req,res){
	var name = req.body.casename;
	var sname = req.body.spousename;
	var gender = req.body.gender;
	var date = req.body.casedate;
	var reason = req.body.casereason;
	var asset = req.body.assets;
	var decision = req.body.decision;
	var c_support = req.body.childsupport;
	var location = req.body.location;
	var budget = req.body.budget;
	var comment = req.body.comments;
	var email = req.user.email;

	var newCase = new Case.divorseCase({
		case_name: name,
		user_email: email,
		case_location: location,
		case_budget: budget,
		case_comments: comment,
		spouse_name: sname,
		spouse_gender: gender,
		marriage_date: date,
		reason_divorse: reason,
		spouse_assets: asset,
		mutual_decision: decision,
		spouse_child_support: c_support,
	});

	Case.createCase(newCase,function(err){
		if(err) throw err;
		console.log('ho gaya');
		req.flash('success_msg', 'Your case has been submitted successfully.');
		res.redirect('/');
	});
});

//Client Criminal case
router.post('/criminal_submit',function(req,res){
	var name = req.body.casename;
	var date = req.body.casedate;
	var offence = req.body.caseoffence;
	var agency = req.body.caseagency;
	var location = req.body.location;
	var budget = req.body.budget;
	var comment = req.body.comments;
	var email = req.user.email;

	var newCase = new Case.criminalCase({
		case_name: name,
		user_email: email,
		case_location: location,
		case_budget: budget,
		case_comments: comment,
		offence: offence,
		offence_date: date,
		agency: agency
	});

	Case.createCase(newCase,function(err){
		if(err) throw err;
		console.log('ho gaya');
		req.flash('success_msg', 'Your case has been submitted successfully.');
		res.redirect('/');
	});
});	

module.exports = router;