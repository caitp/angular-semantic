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
 * @param onEnable Callback after a checkbox is enabled.
 * @param onDisable Callback after a checkbox is disabled.
 * @param onChange Callback after a checkbox is either disabled or enabled.
 *
 * @description
 *
 * A checkbox visually indicates the status of a user's selection
 *
 * **Callbacks**
 * There are 3 callbacks used by the accordion module:
 *   - onDisable()
 *   - onEnable()
 *   - onChange(checked)
 *
 * Each callback will optionally evaluate an AngularJS expression. onChange provides access to the
 * current checkbox state.
 */

/**
 * @ngdoc directive
 * @name ui.semantic.checkbox.directive:toggle
 * @restrict EA
 * @element ANY
 * @scope
 *
 *
 * @param onEnable Callback after a checkbox is enabled.
 * @param onDisable Callback after a checkbox is disabled.
 * @param onChange Callback after a checkbox is either disabled or enabled.
 *
 * @description
 *
 * A checkbox visually indicates the status of a user's selection
 *
 * **Callbacks**
 * There are 3 callbacks used by the accordion module:
 *   - onDisable()
 *   - onEnable()
 *   - onChange(checked)
 *
 * Each callback will optionally evaluate an AngularJS expression. onChange provides access to the
 * current checkbox state.
 */

/**
 * @ngdoc directive
 * @name ui.semantic.checkbox.directive:slider
 * @restrict EA
 * @element ANY
 * @scope
 *
 *
 * @param onEnable Callback after a checkbox is enabled.
 * @param onDisable Callback after a checkbox is disabled.
 * @param onChange Callback after a checkbox is either disabled or enabled.
 *
 * @description
 *
 * A checkbox visually indicates the status of a user's selection
 *
 * **Callbacks**
 * There are 3 callbacks used by the accordion module:
 *   - onDisable(checked)
 *   - onEnable(checked)
 *   - onChange(checked)
 *
 * Each callback will optionally evaluate an AngularJS expression. onChange provides access to the
 * current checkbox state.
 */
angular.forEach(['checkbox', 'slider', 'toggle'], function(name, _) {
  var needCheckbox = name !== 'checkbox' ? 'checkbox ' : '',
      inputType = name !== 'radio' ? 'checkbox' : 'radio';
      
  module.directive(name, function($compile, $parse, $timeout) {
    var directive = {
      restrict: 'EA',
      replace: true,
      require: 'ngModel',
      template: '<div class="ui '+needCheckbox+name+'"><label></label></div>',
      link: function(scope, element, attrs, ctrl) {
        var callbacks = {}, unregister, n = 0, model,
            context = scope,
            $getter = $parse(attrs.ngModel),
            $setter = $getter.assign,
            $input = $('<input type="'+inputType+'" '+'ng-model="'+attrs.ngModel+'">');
        $input = $compile($input)(scope);
        element.prepend($input);
        scope.$watch(attrs.ngModel, function(newval) {
          if (angular.isString(newval) && newval.length) {
            $getter = $parse(newval);
            $setter = $getter.assign;
          }
        });
        angular.forEach(['onEnable', 'onDisable', 'onChange'], function(name) {
          scope.$watch(function() { return attrs[name]; }, function(newval) {
            callbacks[name] = callback(newval);
          });
        });
        angular.forEach(['onChange', 'onEnable', 'onDisable'], function(name) {
          callbacks[name] = callback(attrs[name]);
          attrs.$observe(name, function() {
            callbacks[name] = callback(attrs[name]);
          });
        });
        function callback(attr) {
          if (angular.isDefined(attr)) {
            return $parse(attr);
          } else {
            return function() {};
          }
        }

        element.checkbox({
          verbose: attrs.verbose || false,
          debug: attrs.debug || false,
          performance: attrs.performance || false,

          onEnable: function() {
            if (!$getter(context)) {
              $setter(context, true);
            }
            scope.$evalAsync(function(scope) {
              callbacks.onEnable(context, { checked: true });
            });
          },
          onDisable: function() {
            if ($getter(context)) {
              $setter(context, false);
            }
            scope.$evalAsync(function(scope) {
              callbacks.onDisable(context, { checked: false });
            });
          },
          onChange: function() {
            scope.$evalAsync(function(scope) {
              if(n++ === 0) {
                callbacks.onChange(context, { checked: $getter(context) });
                $timeout(function() { n = 0; });
              }
            });
          },
        });
        scope.$watch(function() { return $getter(context); }, function(value) {
          element.checkbox(value ? 'enable' : 'disable');
        });
      }
    };
    return directive;
  });
});

function RadioGroupCtrl($scope, $originalScope, ngModel) {
  this.elements = [];
  this.name = '';
  $scope.n = 0;
  this.ngModel = ngModel;
  this.$scope = $scope;
  this.$originalScope = $originalScope;
  $scope.wait = function(cb) {
    $scope.$timeout(function() {
      $scope.n = 0;
    }, 0);
  };
}

RadioGroupCtrl.prototype.addElement = function(element) {
  if (!element || this.elements.indexOf(element) > -1) {
    return;
  }
  this.elements.push(element);
  if (!this.active) {
    this.active = element;
  }
};
RadioGroupCtrl.prototype.removeElement = function(element) {
  var index = this.elements.indexOf(element);
  if (index > -1) {
    this.elements.splice(index, 1);
  }
};
RadioGroupCtrl.prototype.setName = function(name) {
  this.name = name;
  this.$scope.$broadcast('radioGroupNameChanged', name);
};
RadioGroupCtrl.prototype.selectElement = function(element, value) {
  var $scope = this.$scope, $originalScope = this.$originalScope, onSelect = this.onSelect,
      last = this.active;
  if(this.active) {
    this.active.children('input')[0].checked = false;
  }
  element.children('input')[0].checked = true;
  this.active = element;
  this.$scope.$evalAsync(function() {
    $scope.valueChanged(value);
    if (onSelect && !($scope.n++)) {
      $scope.wait();
      onSelect($originalScope, {selected: element, value: value});
    }
  });
};

/**
 * @ngdoc directive
 * @name ui.semantic.checkbox.directive:radioGroup
 * @restrict EA
 * @element ANY
 * @scope
 *
 * @param name **required** The name of the form field.
 * @param ngModel **required** The data binding for the radio buttons
 * @param onSelect Callback after a checkbox is enabled.
 *
 * @description
 *
 * A radio-group is a set of mutually exclusive selectable options. The group itself holds a
 * reference to a model, which is manipulated by the selection of child radio elements.
 *
 * The radio-group element requires a name attribute, which each child radio element will
 * automatically share.
 *
 * **Callbacks**
 *   - onSelect(selected, value)
 *     - selected {JQuery element} The selected radio button
 *     - value {*} The selected radio button's model value
 *
 * Each callback will optionally evaluate an AngularJS expression. onChange provides access to the
 * current checkbox state.
 */
module.directive('radioGroup', function($controller, $parse, $timeout) {
  return {
    restrict: 'EA',
    require: '?ngModel',
    link: {
      pre: function(originalScope, element, attrs, ngModel) {
        if (!ngModel) {
          return;
        }

        var $scope = originalScope.$new(),
            $getter = $parse(attrs.ngModel),
            $setter = $getter.assign;
        $scope.valueChanged = function(value) {
          if ($getter(originalScope) !== value) {
            $setter(originalScope, value);
          }
        };
        $scope.$timeout = $timeout;
        var ctrl = $controller('RadioGroupCtrl', {
              '$scope': $scope,
              '$originalScope': originalScope,
              'ngModel': ngModel
            });
        if (ctrl) {
          element.data('$radioGroupController', ctrl);
        }
        ctrl.setName(attrs.name || '');
        $scope.$watch(attrs.name, function(newval) {
          ctrl.setName(newval);
        });

        originalScope.$watch(function() { return $getter(originalScope); }, function(value) {
          originalScope.$broadcast('radioGroupSelectionChanged', value);
        });
        originalScope.$watch(function() { return attrs.onSelect; }, function(value) {
          if (value) {
            ctrl.onSelect = $parse(value);
          } else {
            ctrl.onSelect = function() {};
          }
        });
        attrs.$observe('ngModel', function(newval) {
          if (angular.isString(newval) && newval.length) {
            $getter = $parse(newval);
            $setter = $getter.assign;
          }
        });
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
 * @param value The model value of the radio button.
 * @param onSelect Fires after the item is selected.
 *
 * @description
 *
 * A radio button is an exclusively selectable option of a set.
 *
 * The radio button must be a child of a radio-group.
 *
 * **Callbacks**
 *   - onSelect(selected, value) 
 *     - selected {JQuery element} The selected radio button
 *     - value {*} The selected radio button's model value
 *
 * Each callback will optionally evaluate an AngularJS expression. onChange provides access to the
 * current checkbox state.
 */
.directive('radio', function($compile, $timeout) {
  return {
    restrict: 'EA',
    replace: true,
    require: '^radioGroup',
    template: '<div class="ui radio checkbox"><label></label></div>',
    scope: {
      value: '@',
      onSelect: '&'
    },
    link: function(scope, element, attrs, radioGroup) {
      var $input = $('<input type="radio" name="' + radioGroup.name + '"></input>'), n = 0;
      $input = $compile($input)(scope);
      element.prepend($input);
      scope.$on('radioGroupNameChanged', function(event, name) {
        $input.attr('name', name);
      });
      scope.$on('radioGroupSelectionChanged', function(event, value) {
        if (value == scope.value) {
          element.checkbox('enable');
        }
      });
      radioGroup.addElement(element);
      scope.$on('$destroy', function() {
        radioGroup.removeElement(element);
      });
      element.checkbox({
        debug: attrs.debug || false,
        performance: attrs.performance || false,
        verbose: attrs.verbose || false,

        onEnable: function() {
          radioGroup.selectElement(element, scope.value);
          if (!(n++)) {
            scope.onSelect({selected: element, value: scope.value});
            $timeout(function() { n = 0; });
          }
        }
      });
    }
  };
});

})();
