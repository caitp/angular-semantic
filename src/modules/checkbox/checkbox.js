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
 *   - onDisable()
 *   - onEnable()
 *   - onChange(checked)
 *
 * Each callback will optionally evaluate an AngularJS expression. onChange provides access to the
 * current checkbox state.
 */
angular.forEach(['checkbox', 'slider', 'toggle'], function(name, _) {
  var needCheckbox = name !== 'checkbox' ? 'checkbox ' : '',
      inputType = name !== 'radio' ? 'checkbox' : 'radio';
      
  module.directive(name, function($compile, $timeout) {
    var directive = {
      restrict: 'EA',
      template: '<div class="ui '+needCheckbox+name+'"></div>',
      require: 'ngModel',
      transclude: false,
      replace: true,
      scope: {
        label: '@',
        checked: '=ngModel',
        onEnable: '&',
        onDisable: '&',
        onChange: '&'
      },
      link: function(scope, element, attrs, ctrl) {
        var x = $('<input type="'+inputType+'" ng-model="checked"></input><label></label>');
        element = element.prepend($compile(x)(scope));
        scope.$watch('$$phase', function() {
          element.checkbox({
            verbose: attrs.verbose || false,
            debug: attrs.debug || false,
            performance: attrs.performance || false,

            onEnable: function() {
              scope.onEnable();
            },
            onDisable: function() {
              scope.onDisable();
            },
            onChange: function() {
              scope.checked = element.find('input').prop('checked');
              scope.onChange({checked: scope.checked });
            },
          });
          scope.$watch('checked', function(value) {
            if (value) {
              element.checkbox('enable');
            } else {
              element.checkbox('disable');
            }
          });
        });
      }
    };
    return directive;
  });
});

})();
