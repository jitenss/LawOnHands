var express = require('express');
var router = express.Router();
var passport = require('passport');
var Question = require('../models/question');

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}



router.post('/ask',ensureAuthenticated, function(req, res){
	var questionTitle = req.body.questionTitle;
	var questionDesc = req.body.questionDesc;
	var client_email = req.user.email;
	var newQuestion = new Question({
		client_email: client_email,
		question: questionTitle,
		question_des: questionDesc
	});

	Question.createQuestion(newQuestion,function(err){
		if(err) throw err;
		console.log('ho gaya Question');
		req.flash('success_msg', 'Your Question has been submitted successfully.');
	res.redirect('/questions/check');
	});
});

router.get('/check',ensureAuthenticated, function(req, res){
	Question.getAllQuestions(function(err, result){ 
	if(err) throw err;
	console.log(result);
	res.render('check', {layout: 'layoutb.hbs', result: result});
	});
});

router.get('/answer',ensureAuthenticated, function(req, res){
	if(req.user.user_level=="Client")
	{
		req.flash('error_msg','You are not a lawyer!');
		res.redirect('/users/dashboardc');
	}
	else{
		var question = req.query.question;
		var client_email = req.query.email;
		res.render('answerQuestion', {layout: 'layoutb.hbs', question : question, client_email : client_email});
	}
});

router.post('/answer',ensureAuthenticated, function(req, res){
	if(req.user.user_level=="Client")
	{
		req.flash('error_msg','You are not a lawyer!');
		res.redirect('/users/dashboardc');
	}
	else{
		var client_email = req.body.client_email;
		var question = req.body.question;
		var answerDesc = req.body.answerDesc;
		console.log(client_email,question,answerDesc);	
		Question.answerQuestion(question,client_email,answerDesc,req.user.email,function(err){ 
				if(err) throw err;
				console.log("reached Here");
				req.flash('success_msg','Answer has been posted Successfully!');
				res.redirect('/questions/check');
		});
	}
})

module.exports = router;
