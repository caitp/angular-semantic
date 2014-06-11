(function() {
'use strict';

/**
 * @ngdoc directive
 * @name ui.semantic.buttons.directive:seBtnCheckbox
 * @restrict A
 * @element ANY
 * @scope
 *
 *
 * @param {expression} se-btn-true A custom true model value.
 * @param {expression} se-btn-false A custom false model value.
 * @param {expression} se-btn-class A custom active class value.
 *
 * @description
 *
 * A checkbox button visually indicates the status of a user's selection
 *
 */

/**
 * @ngdoc directive
 * @name ui.semantic.buttons.directive:seBtnRadio
 * @restrict A
 * @element ANY
 * @scope
 *
 *
 * @param {expression} se-btn-radio A custom model value.
 * @param {expression} se-btn-class A custom active class value.
 *
 * @description
 *
 * A radio button visually indicates the status of a user's selection among buttons group
 *
 */

angular.module('ui.semantic.buttons',[])

.controller('seButtonsConfigCtrl', function() {
    this.defaultTrueValue = true;
    this.defaultFalseValue = false;
    this.defaultActiveClass = 'active';
})

.directive('seBtnCheckbox', function() {
  return {
    require:['seBtnCheckbox', 'ngModel'],
    controller:'seButtonsConfigCtrl',
    link: function(scope, elm, attrs, ctrls) {
      var btnsCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];

      function getBtnTrueValue() {
        var tVal = scope.$eval(attrs.seBtnTrue);
        return (angular.isDefined(tVal)) ? tVal : btnsCtrl.defaultTrueValue;
      }

      function getBtnFalseValue() {
        var fVal = scope.$eval(attrs.seBtnFalse);
        return (angular.isDefined(fVal)) ? fVal : btnsCtrl.defaultFalseValue;
      }

      function getActiveClass() {
        var cVal = scope.$eval(attrs.seBtnClass);
        return (angular.isDefined(cVal)) ? cVal : btnsCtrl.defaultActiveClass;
      }

      function updateFn(value) {
        elm.toggleClass(getActiveClass(), angular.equals(value, getBtnTrueValue()));
        return value;
      }

      function toggleFn() {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue((elm.hasClass(getActiveClass()) ? getBtnFalseValue() :
                                                                      getBtnTrueValue()));
        });
      }

      ngModelCtrl.$parsers.push(updateFn);
      ngModelCtrl.$formatters.push(updateFn);
      elm.on('click', toggleFn);
    }
  };
})
.directive('seBtnRadio', function() {
  return {
    require:['seBtnRadio', 'ngModel'],
    controller:'seButtonsConfigCtrl',
    link: function(scope, elm, attrs, ctrls) {
      var btnsCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];

      function getActiveClass() {
        var cVal = scope.$eval(attrs.seBtnClass);
        return (angular.isDefined(cVal)) ? cVal : btnsCtrl.defaultActiveClass;
      }

      function updateFn(value) {
        var btnVal = scope.$eval(attrs.seBtnRadio);
        elm.toggleClass(getActiveClass(), angular.equals(value, btnVal));
        return value;
      }

      function toggleFn() {
        var isActiveElm = elm.hasClass(getActiveClass());
        if(!isActiveElm){
          scope.$apply(function() {
            var btnVal = scope.$eval(attrs.seBtnRadio);
            ngModelCtrl.$setViewValue((isActiveElm) ? null : btnVal);
          });
        }
      }

      ngModelCtrl.$parsers.push(updateFn);
      ngModelCtrl.$formatters.push(updateFn);
      elm.on('click', toggleFn);
    }
  };
});
})();