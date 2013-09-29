(function() {

var module = angular.module('ui.semantic.checkbox', []);

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
        element.checkbox({
          verbose: scope.verbose || false,
          debug: scope.debug || false,
          performance: scope.performance || false,

          onEnable: function() {
            scope.onEnable();
          },
          onDisable: function() {
            scope.onDisable();
          },
          onChange: function() {
            scope.onChange({checked: scope.checked});
          },
        });
        scope.$watch('checked', function(value) {
          if (value) {
            element.checkbox('enable');
          } else {
            element.checkbox('disable');
          }
        });
      }
    };
    return directive;
  });
});

})();
