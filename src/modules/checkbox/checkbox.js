(function() {

var module = angular.module('ui.semantic.checkbox', []);

var radioHandlers = {
  'select': function(model, group, attrs) {
    if (!this.hasClass('enabled')) {
      this.parent().nextAll('.enabled').checkbox('disable');
      this.checkbox('enable');
    }
  },
};

var checkboxHandlers = {
  'toggle': function(model, group, attrs) {
    this.checkbox('toggle');
  },
  'enable': function(model, group, attrs) {
    this.checkbox('enable');
  },
  'disable': function(model, group, attrs) {
    this.checkbox('disable');
  },
  'enable-all': function(model, group, attrs) {
    this.parent().nextAll('.disabled').checkbox('enable');
  },
  'disable-all': function(model, group, attrs) {
    this.parent().nextAll('.enabled').checkbox('disable');
  }
};

angular.forEach(['checkbox', 'slider', 'toggle'], function(name, _) {
  var needCheckbox = name !== 'checkbox' ? 'checkbox ' : '',
      inputType = name !== 'radio' ? 'checkbox' : 'radio',
      legalHandlers = name === 'radio' ? radioHandlers : checkboxHandlers,
      defaultTrigger = 'click', defaultHandler = legalHandlers[0];
      
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
        onEnabled: '&',
        onDisabled: '&',
        onChanged: '&'
      },
      link: function(scope, element, attrs, ctrl) {
        var x = $('<input type="'+inputType+'" ng-model="checked"></input><label></label>');
        element = element.prepend($compile(x)(scope));
        element.checkbox({
          onEnabled: function() {
            scope.onEnabled();
          },
          onDisabled: function() {
            scope.onDisabled();
          },
          onChanged: function() {
            scope.onChanged({checked: scope.checked});
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

/**
 * @ngdoc directive
 * @name ui.semantic.checkbox.directive
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

})();
