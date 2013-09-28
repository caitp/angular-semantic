angular.module('ui.semantic.accordion', [])

.directive('accordion', function() {
  return {
    restrict: 'EAC',
    scope: {
      // Accordion settings
      // exclusive: '=',
      // collapsible: '=',
      // duration: '=',
      // easing: '=',
      
      // Accordion callbacks
      onClose: '&',
      onOpen: '&',
      onChange: '&',

      active: '@'
    },
    compile: function($parse) {
      return function(scope, element, attrs) {
        scope.exclusive = attrs.exclusive && scope.$parent.$eval(attrs.exclusive);
        scope.collapsible = attrs.collapsible && scope.$parent.$eval(attrs.collapsible);
        scope.duration = attrs.duration && scope.$parent.$eval(attrs.duration);
        scope.easing = attrs.easing && scope.$parent.$eval(attrs.easing);

        jQuery(element).accordion({
          exclusive: scope.exclusive,
          collapsible: scope.collapsible,
          duration: scope.duration,
          easing: scope.easing,

          onClose: function() {
            scope.active = $(this);
            scope.onClose();
          },

          onOpen: function() {
            scope.active = $(this);
            scope.onOpen();
          },

          onChange: function() {
            scope.active = $(this);
            scope.onChange();
          }
        });
      }
    }
  }
});
