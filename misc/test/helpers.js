// jasmine matcher for expecting an element to have a css class
// https://github.com/angular/angular.js/blob/master/test/matchers.js
beforeEach(function() {
  jasmine.addMatchers({
      toHaveClass: function() {
          return {
              compare: function(actual, cls) {
                  var result = {
                      pass:actual.hasClass(cls)
                  }
                  if(!result.pass){
                      result.message = "Expected '" + actual + "' to have class '" + cls + "'.";
                  }
                  return result;
              }
          }
      }
  });
  $.camelCase = function(input) { 
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
  };
});