angular.module('ui.semantic.modal', [])

.directive('modal', function($parse) {
  return {
    restrict: 'EA',
    template: '<div class="ui modal" ng-transclude></div>',
    transclude: true,
    replace: true,
    link: function(originalScope, element, attrs) {
      var $scope = originalScope.$new();
      var vars = {
        'debug': [],
        'verbose': [],
        'performance': [],

        'isActive': [],
        'offset': [],
        'context': [],
        'closable': [],
        'transition': [],
        'duration': [],
        'easing': [],

        // Callbacks
        'onShow': [],
        'onHide': []
      };

      angular.forEach(Object.keys(vars), function(name) {
        var data = vars[name];
        parseVar(data, attrs[name]);
        $scope.$watch(function() { return attrs[name]; }, function(newval) {
          parseVar(data, newval);
        });
      });
      function parseVar(data, value) {
        if (typeof value === 'string') {
          var parsed = $parse(value);
          data[0] = angular.bind(originalScope, parsed, originalScope);
          data[1] = angular.bind(originalScope, parsed.assign, originalScope);
        } else {
          data[1] = data[0] = function() {};
        }
      }
      function get(name) {
        return vars[name][0]();
      }
      function set(name, value) {
        return vars[name][1](value);
      }
      function run(name, locals) {
        return vars[name][0](locals);
      }

      element.modal({
        // Modal settings
        offset: get('offset') || 0,
        context: get('context') || 'body',
        closable: get('closable') || true,
        transition: get('transition') || 'scale',
        duration: get('duration') || 400,
        easing: get('easing') || 'easeOutExpo',

        // Callbacks
        onShow: function() {
          $scope.$evalAsync(function() {
            set('isActive',true);
            run('onShow',{modal: $(this)});
          });
        },

        onHide: function() {
          $scope.$evalAsync(function() {
            set('isActive',false);
            run('onHide',{modal: $(this)});
          });
        },

        // Debug Options
        debug: get('debug') || false,
        performance: get('performance') || false,
        verbose: get('verbose') || false
      });

      $scope.$watch(function() { return get('isActive'); }, function(newval) {
        if (get('isActive')) {
          element.modal('show');
        } else {
          element.modal('hide');
        }
      });
    }
  };
})

.service('$modal', function() {
    
});
