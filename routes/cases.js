var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
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
		res.redirect('/users/dashboardc');
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
		res.redirect('/users/dashboardc');
	});
});	

//Client Corporate case
router.post('/corporate_submit',function(req,res){
	var name = req.body.casename;
	var companyname = req.body.companyname;
	var type = req.body.type;
	var year_of_conflict = req.body.year_of_conflict;
	var reason = req.body.reason;
	var assets = req.body.assets;
	var bilateral_conflict = req.body.bilateral_conflict;
	var location = req.body.location;
	var budget = req.body.budget;
	var comment = req.body.comments;
	var email = req.user.email;

	var newCase = new Case.corporateCase({
		case_name: name,
		user_email: email,
		case_location: location,
		case_budget: budget,
		case_comments: comment,
		company_name: companyname,
		type: type,
		year_of_conflict: year_of_conflict,
		reason: reason,
		assets: assets,
		bilateral_conflict: bilateral_conflict
	});

	Case.createCase(newCase,function(err){
		if(err) throw err;
		console.log('ho gaya');
		req.flash('success_msg', 'Your case has been submitted successfully.');
		res.redirect('/users/dashboardc');
	});
});	

//Client DUI case
router.post('/dui_submit',function(req,res){
	var name = req.body.casename;
	var driver = req.body.name;
	var gender = req.body.gender;
	var date = req.body.date;
	var time = req.body.time;
	var address = req.body.address;
	var plate = req.body.plate_no;
	var damage = req.body.damage;
	//var description = req.body.v_description;
	var reporting_officer =req.body.reporting_officer;
	var witness = req.body.witness;
	var location = req.body.location;
	var budget = req.body.budget;
	var comment = req.body.comments;
	var email = req.user.email;

	var newCase = new Case.duiCase({
		case_name: name,
		user_email: email,
		case_location: location,
		case_budget: budget,
		case_comments: comment,
		driver_name: driver,
		gender: gender,
		incident_date: date,
		time: time,
		address: address,
		plate_no: plate,
		reporting_officer: reporting_officer,
		damage: damage,
		witness: witness
	});

	Case.createCase(newCase,function(err){
		if(err) throw err;
		console.log('ho gaya');
		req.flash('success_msg', 'Your case has been submitted successfully.');
		res.redirect('/users/dashboardc');
	});
});	


router.post('/searchcase',ensureAuthenticated,function(req,res){
	var casename = req.body.cname;
	var email = req.user.email;
	console.log(casename);
	Case.getCaseByEmailAndName(casename,email,function(err,result){
		if(err) throw err;
		console.log("aa");
		res.render('searchedcase',{layout:'layoutb.hbs',casename: casename,result: result});
	});

});


router.get('/searchcase',ensureAuthenticated,function(req,res){
	var email = req.user.email;
	Case.getCaseByEmail(email,function(err,result){
		if(err) throw err;
		res.render('searchcase',{layout:'layoutb.hbs',cases: result});
	});
});


router.post('/submitlawyer',ensureAuthenticated,function(req,res){
	var lawyer_email = req.body.lawyers_email;
	var client_email = req.user.email;
	var casename = req.body.casename;

	User.Lawyer.getLawyerByEmail(lawyer_email, function(err, lawyer){
		if(err) throw err;
		console.log(lawyer_email);
		if(lawyer){
			Case.updateCaseByLawyer(casename,client_email,lawyer_email,function(err)
			{
				if(err) throw err;
				console.log("Submitted to Lawyer");
				req.flash('success_msg','Your case has been submitted to the lawyer');
				res.redirect('/users/dashboardc');
			});
		}
		else{
			console.log("No lawyer exists");
			req.flash('error_msg', 'No such Lawyer Exists');
			res.redirect('/users/dashboardc');
		}
	});
});

router.post('/pendingcase',ensureAuthenticated,function(req,res){
	var lawyer_email = req.user.email;
	var casename = req.body.casename;
	console.log(casename);
	Case.ApproveCaseByLawyer(casename,lawyer_email,function(err){
		if(err) throw err;
		console.log("Approved",casename,lawyer_email);
		res.redirect('/cases/pendingcase');
	});
});

router.get('/approvedcase',ensureAuthenticated,function(req,res){
	var user_email = req.user.email;
	var user_level = req.user.user_level;
	if(user_level == "Lawyer"){
	Case.getApprovedCasesByLawyer(user_email,function(err,result){
		if(err) throw err;
		console.log(result);
		res.render('approved',{layout: 'layoutb.hbs',result: result});
	});
	}
	else{
	Case.getApprovedCasesByClient(user_email,function(err,result){
		if(err) throw err;
		console.log(result);
		res.render('approved',{layout: 'layoutb.hbs',result: result});
	});
	
	}
});

router.get('/pendingcase',ensureAuthenticated,function(req,res){
	var user_email = req.user.email;
	var user_level = req.user.user_level;
	if(user_level == "Lawyer"){
	Case.getPendingCasesByLawyer(user_email,function(err,result){
		if(err) throw err;
		console.log(result);
		res.render('pending',{layout: 'layoutb.hbs',result: result});
	});
	}
	else{
	Case.getPendingCasesByClient(user_email,function(err,result){
		if(err) throw err;
		console.log(result);
		res.render('pending',{layout: 'layoutb.hbs',result: result});
	});
	
	}
});

router.get('/appointment',ensureAuthenticated,function(req,res){
	var client_email = req.user.email;
	
	Case.getCaseByEmail(client_email,function(err,result){
		if(err) throw err;
		console.log(result);
		res.render('appointment',{layout: 'layoutb.hbs',result: result});
	});
});

module.exports = router;
