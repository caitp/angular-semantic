angular.module('ui.semantic.accordion', [])

/**
 * @ngdoc directive
 * @name ui.semantic.accordion.directive:accordion
 * @restrict EAC
 * @element ANY
 * @priority 1000
 * @scope
 *
 * @param exclusive Set to false to allow multiple sections to be open at the same time
 * @param collapsible Set to false to require an accordion to always have a section open
 * @param duration Duration in ms of opening animation
 * @param easing Easing equation used for accordion (additional options require
 *               [jQuery easing](http://gsgd.co.uk/sandbox/jquery/easing/))
 *
 * @param onClose AngularJS expression to be evaluated when a content element is closed.
 * @param onOpen  AngularJS expression to be evaluated when a content element is opened.
 * @param onChange  AngularJS expression to be evaluated when a content element is changed.
 *
 * @description
 *
 * An accordion displays a single piece of content, while allowing the option of displaying other
 * related content.
 *
 * **Callbacks**
 * There are 3 callbacks used by the accordion module:
 *   - onClose()
 *   - onOpen()
 *   - onChange()
 *
 * Each callback will optionally evaluate an AngularJS expression, with a local variable _active_,
 * granting access to the currently active content.
 */
.directive('accordion', function($timeout, $parse) {
  return {
    restrict: 'EAC',
    scope: {
      // Accordion callbacks
      onClose: '&',
      onOpen: '&',
      onChange: '&',

      active: '@'
    },
    transclude: true,
    replace: true,
    template: '<div ng-transclude></div>',
    controller: function() {},
    compile: function() {
      return function(scope, element, attrs) {
        scope.exclusive = attrs.exclusive && scope.$parent.$eval(attrs.exclusive);
        scope.collapsible = attrs.collapsible && scope.$parent.$eval(attrs.collapsible);
        scope.duration = attrs.duration && scope.$parent.$eval(attrs.duration);
        scope.easing = attrs.easing && scope.$parent.$eval(attrs.easing);

        element.addClass('ui').addClass('accordion');

        // Wait for the DOM to be built before constructing the accordion.
        var unregister = scope.$watch('$$phase', function() {
          unregister();
          $(element).accordion({
            debug: attrs.debug || false,
            performance: attrs.performance || false,
            verbose: attrs.verbose || false,

            exclusive: scope.exclusive,
            collapsible: scope.collapsible,
            duration: scope.duration,
            easing: scope.easing,

            onClose: function() {
              scope.onClose({ 'active': $(this) });
            },

            onOpen: function() {
              scope.onOpen({ 'active': $(this) });
            },

            onChange: function() {
              scope.onChange({ 'active': $(this) });
            }
          });
        });
      };
    }
  };
});
