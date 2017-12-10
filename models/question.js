var mongoose = require('mongoose');

var QuestionSchema = mongoose.Schema({
	client_email: {
		type: String
	},
	question:{
		type: String
	},
	question_des:{
		type: String
	},
	answers : [{
	lawyer_email: {
		type: String
	},
	answerDesc:{
		type: String
	},
}]
}
);

var Question  = module.exports =  mongoose.model('Question', QuestionSchema);

module.exports.createQuestion = function(newQuestion, callback){
	newQuestion.save(callback);
	console.log(newQuestion);
};

module.exports.getQuestionByClientEmail = function(question,client_email,callback){
	var query = ({client_email: client_email,
				question: question});
	Question.findOne(query,callback);
}
module.exports.getAllQuestions = function(callback){
	var query = {};
	Question.find(query,callback);
}
module.exports.answerQuestion = function(question,client_email,answerDesc,lawyer_email,callback){
	var query = {client_email: client_email,
				question: question};
	console.log(query, lawyer_email,answerDesc);
	Question.update(query,{ $push: {answers: {answerDesc: answerDesc, lawyer_email : lawyer_email}}},callback)
}
