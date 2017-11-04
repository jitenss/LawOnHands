Handlebars.registerHelper('if_eq', function (conditional) {
  if(conditional == "Client") {
      return true;
   } else {
      return false;
   }
});

module.exports