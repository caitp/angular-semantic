angular.module('ui.semantic.accordion', [])

/**
 * @ngdoc directive
 * @name ui.semantic.accordion.directive:accordion
 * @restrict EA
 * @element ANY
 * @scope
 *
 * @param {boolean=true} exclusive Set to false to allow multiple sections to be open at the same
 * time
 * @param {boolean=true} collapsible Set to false to require an accordion to always have a section
 * open
 * @param {number=400} duration Duration in ms of opening animation
 * @param {string=linear} easing Easing equation used for accordion (additional options require
 * {@link http://gsgd.co.uk/sandbox/jquery/easing/ jQuery easing}
 *
 * @param {expression} on-close AngularJS expression to be evaluated when a content element is
 * closed.
 * @param {expression} on-cpen AngularJS expression to be evaluated when a content element is
 * opened.
 * @param {expression} on-change AngularJS expression to be evaluated when a content element is
 * changed.
 *
 * @description
 *
 * An accordion displays a single piece of content, while allowing the option of displaying other
 * related content.
 *
 * **Events**
 * There are 3 events which evaluate expressions used by the accordion directive:
 *   - onClose()
 *   - onOpen()
 *   - onChange()
 */
.directive('accordion', function($timeout, $parse) {
  return {
    restrict: 'EA',
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
