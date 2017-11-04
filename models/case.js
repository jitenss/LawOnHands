var mongoose = require('mongoose');
// var util  = require('util');
// // Case Schema
// function CaseSchema(){
// 	mongoose.Schema.apply(this, arguments);
// 	this.add({
// 		case_name: String,
// 		user_email: String,
// 		case_location: String,
// 		case_budget: String,
// 		case_comments:  String,
// 	},{discriminatorKey: 'case_type'});

// }
// util.inherits(CaseSchema,mongoose.Schema);

var CaseSchema = mongoose.Schema({
	case_name: {
		type: String
	},
	user_email: {
		type: String
	},
	case_location: {
		type: String
	},
	case_budget: {
		type: String
	},
	case_comments: {
		type: String
	},
	case_lawyer: {
		type: String
	},
	case_request: {
		type: Boolean,
		default: false			// False means pending case
	}
},	{discriminatorKey : 'case_type' }
);

var jitencase = mongoose.model('case',CaseSchema);

//Divorse Schema
var DivorseSchema =  new mongoose.Schema(
	{
	spouse_name: String,
	spouse_gender: String,
	marriage_date: String,
	reason_divorse: String,
	spouse_assets: String ,
	mutual_decision: String ,
	spouse_child_support: String
	},
	{discriminatorKey : 'case_type' }
);

//Criminal Schema
var CriminalSchema = new mongoose.Schema(
	{
	offence: String,
	offence_date: String,
	agency: String
	},
	{ discriminatorKey : 'case_type' }
);

//Corporate Schema
var CorporateSchema = new mongoose.Schema(
	{
	company_name: String,
	type: String,
	year_of_conflict: String,
	reason: String,
	assets: String,
	bilateral_conflict: String,
	},
	{ discriminatorKey : 'case_type' }
)

//DUI Schema
var DuiSchema = new mongoose.Schema(
	{
	driver_name: String,
	gender: String,
	incident_date: String,
	time: String,
	address: String,
	plate_no: String,
	reporting_officer: String,
	damage: String,
	witness: String,
	},
	{ discriminatorKey : 'case_type' }
)

var Case = module.exports = {
		divorseCase:	jitencase.discriminator('Divorse', DivorseSchema),
		criminalCase:	jitencase.discriminator('Criminal', CriminalSchema),
		corporateCase:	jitencase.discriminator('Corporate', CorporateSchema),
		duiCase:		jitencase.discriminator('DUI', DuiSchema),
}
//var criminalCase = module.exports = mongoose.model('cCase', CriminalSchema);

module.exports.createCase = function(newCase, callback){
	newCase.save(callback);
	console.log(newCase);
};

module.exports.getCaseByEmailAndName = function(name,email,callback){
	var query = ({user_email: email,
				case_name: name});
	jitencase.find(query,callback);
}

module.exports.updateCaseByNameAndLawyerID = function(casename,client_email,lawyer_email,callback)
{
	var query = {
		case_name: casename,
		user_email: client_email
	};

	jitencase.update(query,{case_lawyer: lawyer_email},callback);
}

module.exports.getApprovedCasesByLawyer = function(lawyer_email,callback){
	var query = {
		case_request: true,
		case_lawyer : lawyer_email
	};
	jitencase.find(query,callback);
}

module.exports.getPendingCasesByLawyer = function(lawyer_email,callback){
	var query = {
		case_request: {$eq: false},
		case_lawyer : lawyer_email
	};
	jitencase.find(query,callback);
}