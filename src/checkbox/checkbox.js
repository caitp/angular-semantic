(function() {

var module = angular.module('ui.semantic.checkbox', []);

/**
 * @ngdoc directive
 * @name ui.semantic.checkbox.directive:checkbox
 * @restrict EA
 * @element ANY
 * @scope
 *
 *
 * @param {expression} on-enable Callback after a checkbox is enabled.
 * @param {expression} on-disable Callback after a checkbox is disabled.
 * @param {expression} on-change Callback after a checkbox is either disabled or enabled.
 *
 * @description
 *
 * A checkbox visually indicates the status of a user's selection
 *
 * **Events**
 *
 * There are 3 events which evaluate expressions used by the checkbox directive:
 *
 *   - onDisable(checked)
 *     - checked {Boolean} The checkbox's checked state
 *   - onEnable(checked)
 *     - checked {Boolean} The checkbox's checked state
 *   - onChange(checked)
 *     - checked {Boolean} The checkbox's checked state
 */

/**
 * @ngdoc directive
 * @name ui.semantic.checkbox.directive:toggle
 * @restrict EA
 * @element ANY
 * @scope
 *
 *
 * @param {expression} on-enable Callback after a checkbox is enabled.
 * @param {expression} on-disable Callback after a checkbox is disabled.
 * @param {expression} on-change Callback after a checkbox is either disabled or enabled.
 *
 * @description
 *
 * A checkbox visually indicates the status of a user's selection
 *
 * **Events**
 *
 * There are 3 events which evaluate expressions used by the toggle directive:
 *
 *   - onDisable(checked)
 *     - checked {Boolean} The checkbox's checked state
 *   - onEnable(checked)
 *     - checked {Boolean} The checkbox's checked state
 *   - onChange(checked)
 *     - checked {Boolean} The checkbox's checked state
 */

/**
 * @ngdoc directive
 * @name ui.semantic.checkbox.directive:slider
 * @restrict EA
 * @element ANY
 * @scope
 *
 *
 * @param {expression} on-enable Callback after a checkbox is enabled.
 * @param {expression} on-disable Callback after a checkbox is disabled.
 * @param {expression} on-change Callback after a checkbox is either disabled or enabled.
 *
 * @description
 *
 * A checkbox visually indicates the status of a user's selection
 *
 * **Events**
 * There are 3 events which evaluate expressions used by the slider directive:
 *   - onDisable(checked)
 *     - checked {Boolean} The checkbox's checked state
 *   - onEnable(checked)
 *     - checked {Boolean} The checkbox's checked state
 *   - onChange(checked)
 *     - checked {Boolean} The checkbox's checked state
 */
angular.forEach(['checkbox', 'slider', 'toggle'], function(name, _) {
  var needCheckbox = name !== 'checkbox' ? 'checkbox ' : '',
      inputType = name !== 'radio' ? 'checkbox' : 'radio';
      
  module.directive(name, function($compile, $parse) {
    var directive = {
      restrict: 'EA',
      replace: true,
      require: '?ngModel',
      template:
        '<div class="ui '+needCheckbox+name+'"><input type="checkbox" /><label></label></div>',
      link: function(scope, element, attrs, ctrl) {
        if (!ctrl) {
          return;
        }
        var $input = element.find('input').eq(0);
        $input[0].checked = ctrl.$modelValue;
        $input.attr('checked', ctrl.$modelValue);
        var callbacks = {
            onEnable: attrs.onEnable && $parse(attrs.onEnable),
            onDisable: attrs.onDisable && $parse(attrs.onDisable),
            onChange: attrs.onChange && $parse(attrs.onChange)
        };
        ctrl.$parsers.push(updateFn);
        ctrl.$formatters.push(updateFn);
        element.on('click', toggleFn);

        function updateFn(value) {
          $input[0].checked = value;
          $input.attr('checked', value);
          var cb = value ? 'onEnable' : 'onDisable';
          if (value !== ctrl.$viewValue) {
            if (callbacks.onChange) {
              callbacks.onChange(scope, {checked: ctrl.$viewValue});
            }
            if (callbacks[cb]) {
              callbacks[cb](scope, {checked: value});
            }
          }
          return value;
        }

        function toggleFn(event) {
          scope.$apply(function() {
            ctrl.$setViewValue(!ctrl.$modelValue);
          });
        }
      }
    };
    return directive;
  });
});

function RadioGroupCtrl($scope, $element, ngModel, onSelect) {
  var elements = [], active;
  ngModel.$parsers.push(updateFn);
  ngModel.$formatters.push(updateFn);
  this.addElement = function(element) {
    if (element && elements.indexOf(element) < 0) {
      var input = element.find('input').eq(0);
      input[0].name = $element.attr('name');
      input.attr('name', input[0].name);
      elements.push(element);
    }
  };
  this.removeElement = function(element) {
    var index = elements.indexOf(element);
    if (index >= 0) {
      elements.splice(index, 1);
    }
  };
  this.select = function(value) {
    ngModel.$setViewValue(value);
  };
  this.updateValue = function(element, value) {
    if (element === active || !active) {
      ngModel.$setViewValue(value);
    }
  };
  function updateFn(value) {
    var origActive = active;
    active = undefined;
    for (var i = 0; i < elements.length; ++i) {
      var $element = elements[i],
          val = $element.prop('value'),
          input = $element.find('input').eq(0);
      if (val === value) {
        active = $element;
        input[0].checked = true;
      } else {
        input[0].checked = false;
      }
    }
    if (active !== origActive) {
      var radioSelect = active && active.data('$radioOnSelect');
      if (radioSelect) {
        radioSelect($scope, {
          'selected': active,
          'value': (active && value) || undefined
        });
      }
      if (onSelect) {
        onSelect($scope, {
          'selected': active,
          'value': (active && value) || undefined
        });
      }
    }
    return (active && value) || undefined;
  }
}

/**
 * @ngdoc directive
 * @name ui.semantic.checkbox.directive:radio-group
 * @restrict EA
 * @element ANY
 * @scope
 *
 * @param {string} name **required** The name of the form field.
 * @param {string} ng-model **required** The data binding for the radio buttons
 * @param {expression} on-select Callback after a checkbox is enabled.
 *
 * @description
 *
 * A radio-group is a set of mutually exclusive selectable options. The group itself holds a
 * reference to a model, which is manipulated by the selection of child radio elements.
 *
 * The radio-group element requires a name attribute, which each child {@link
 * ui.semantic.checkbox.directive:radio radio} element will automatically share.
 *
 * **Events**
 *
 *   - onSelect(selected, value)
 *     - selected {JQuery element} The selected radio button
 *     - value {*} The selected radio button's model value
 */
module.directive('radioGroup', function($controller, $parse) {
  return {
    restrict: 'EA',
    require: '?ngModel',
    link: {
      pre: function($scope, element, attrs, ngModel) {
        if (!ngModel) {
          return;
        }
        var onSelect = attrs.onSelect && $parse(attrs.onSelect),
            ctrl = $controller('RadioGroupCtrl', {
              '$scope': $scope,
              '$element': element,
              'ngModel': ngModel,
              'onSelect': onSelect
            });
        if (ctrl) {
          element.data('$radioGroupController', ctrl);
        }
      }
    }
  };
})

.controller('RadioGroupCtrl', RadioGroupCtrl)

/**
 * @ngdoc directive
 * @name ui.semantic.checkbox.directive:radio
 * @restrict EA
 * @element ANY
 * @scope
 *
 * @param {string} value The model value of the radio button.
 * @param {expression} on-select Fires after the item is selected.
 *
 * @description
 *
 * A radio button is an exclusively selectable option of a set.
 *
 * The radio button must be a child of a {@link ui.semantic.checkbox.directive:radio-group
 * radio-group}.
 *
 * **Events**
 *
 *   - onSelect(selected, value) 
 *     - selected {JQuery element} The selected radio button
 *     - value {*} The selected radio button's model value
 *
 */
.directive('radio', function($compile, $parse, $interpolate) {
  return {
    restrict: 'EA',
    replace: true,
    require: '^radioGroup',
    template: '<div class="ui radio checkbox"><input type="radio" name="" /><label></label></div>',
    link: function(scope, element, attrs, radioGroup) {
      var myValue = $interpolate(attrs.value || '')(scope),
          onSelect = attrs.onSelect && $parse(attrs.onSelect);
      element[0].value = myValue;
      if (onSelect) {
        element.data('$radioOnSelect', onSelect);
      }
      attrs.$observe('value', function(value) {
        myValue = value;
        element[0].value = value;
        radioGroup.updateValue(element, value);
      });
      element.on('click', selectFn);
      radioGroup.addElement(element);
      scope.$on('$destroy', function() {
        radioGroup.removeElement(element);
      });

      function selectFn() {
        scope.$apply(function() {
          radioGroup.select(myValue, onSelect);
        });
      }
    }
  };
});

})();
