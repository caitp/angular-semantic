// jasmine matcher for expecting an element to have a css class
// https://github.com/angular/angular.js/blob/master/test/matchers.js

function when(expr, waitFor) {
  var startTime = Date.now();
  return new Promise(function(resolve, reject) {
    setTimeout(maybe);
    function maybe() {
      try {
        if (expr()) {
          resolve();
        } else {
          var now = Date.now();
          if ((now - startTime) < waitFor) {
            setTimeout(maybe);
          } else {
            reject(new Error(waitFor + "ms elapsed."));
          }
        }
      } catch (e) {
        reject(e);
      }
    }
  });
}

beforeEach(function() {
  jasmine.addMatchers({
    toHaveClass: function() {
      return {
        compare: function(actual, expected) {
          var result = {};
          result.pass = angular.element(actual).hasClass(expected);
          if (!result.pass) {
            result.message =
                "Expected '" + angular.mock.dump(actual) + "' to have class '" + expected + "'.";
          }
          return result;
        }
      };
    }
  });
  $.camelCase = function(input) { 
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
  };
});