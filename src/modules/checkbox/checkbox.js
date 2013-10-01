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
      
  module.directive(name, function($compile, $parse, $timeout) {
    var directive = {
      restrict: 'EA',
      replace: true,
      require: 'ngModel',
      template: '<div class="ui '+needCheckbox+name+'"><label></label></div>',
      link: function(scope, element, attrs, ctrl) {
        var callbacks = {}, unregister, skip = false, model,
            context = scope,
            $getter = $parse(attrs.ngModel),
            $setter = $getter.assign,
            $input = $('<input type="'+inputType+'" '+'ng-model="'+attrs.ngModel+'">');
        $input = $compile($input)(scope);
        element.prepend($input);
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


        unregister = scope.$watch('$$phase', function() {
          unregister();
          element.checkbox({
            verbose: attrs.verbose || false,
            debug: attrs.debug || false,
            performance: attrs.performance || false,

            onEnable: function() {
              scope.$evalAsync(function(scope) {
                $setter(context, true);
                callbacks.onEnable(context, { checked: true });
              });
            },
            onDisable: function() {
              scope.$evalAsync(function(scope) {
                $setter(context, false);
                callbacks.onDisable(context, { checked: false });
              });
            },
            onChange: function() {
              scope.$evalAsync(function(scope) {
                callbacks.onChange(context, { checked: $getter(context) });
              });
            },
          });
          scope.$watch(function() { return $getter(context); }, function(value) {
            element.checkbox(value ? 'enable' : 'disable');
          });
        });
      }
    };
    return directive;
  });
});

})();
