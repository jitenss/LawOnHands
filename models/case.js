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

module.exports = {
		divorseCase:	jitencase.discriminator('divorse', DivorseSchema),
		criminalCase:	jitencase.discriminator('criminal', CriminalSchema)
}
//var criminalCase = module.exports = mongoose.model('cCase', CriminalSchema);

module.exports.createCase = function(newCase, callback){
	newCase.save(callback);
	console.log(newCase);
};
