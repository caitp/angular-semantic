angular.module('ui.semantic.modal', [])

.directive('modal', function($parse) {
  return {
    restrict: 'EA',
    template: '<div class="ui modal" ng-transclude></div>',
    transclude: true,
    replace: true,
    link: function(originalScope, element, attrs) {
      var $scope = originalScope.$new(), already = false;
      var vars = {
        'debug': ['@'],
        'verbose': ['@'],
        'performance': ['@'],

        'isActive': ['@'],
        'offset': ['@'],
        'context': ['@'],
        'closable': ['@'],
        'transition': ['@'],
        'duration': ['@'],
        'easing': ['@'],

        // Callbacks
        'onShow': ['&'],
        'onHide': ['&']
      };

      angular.forEach(Object.keys(vars), function(name) {
        var data = vars[name];
        parseVar(name, data, attrs[name]);
        $scope.$watch(function() { return attrs[name]; }, function(newval) {
          parseVar(name, data, newval);
        });
      });
      function parseVar(name, data, value) {
        if (typeof value === 'string') {
          try {
            var parsed = $parse(value);
            data[1] = angular.bind(originalScope, parsed, originalScope);
            data[2] = angular.bind(originalScope, parsed.assign, originalScope);
          } catch (e) {
            if (data[0] === '&') {
              throw e;
            }
          }
        }
        if (!data[1]) {
          data[1] = data[2] = function() { return attrs[name]; };
        }
      }
      function get(name) {
        return vars[name][1]();
      }
      function set(name, value) {
        return vars[name][2](value);
      }
      function run(name, locals) {
        return vars[name][1](locals);
      }
      function modalArgs() {
        var args = {
          // Modal settings
          offset: get('offset') || parseInt(attrs.offset, 10) || 0,
          context: get('context') || attrs.context || 'body',
          closable: get('closable') || attrs.closable || true,
          transition: get('transition') || attrs.transition || 'scale',
          duration: get('duration') || parseInt(attrs.duration, 10) || 400,
          easing: get('easing') || attrs.easing || 'easeOutExpo',

          // Callbacks
          onShow: function() {
            already = true;
            $scope.$evalAsync(function() {
              set('isActive',true);
              run('onShow',{modal: $(this)});
            });
          },

          onHide: function() {
            already = true;
            $scope.$evalAsync(function() {
              set('isActive',false);
              run('onHide',{modal: $(this)});
            });
          },

          // Debug Options
          debug: get('debug') || attrs.debug || false,
          performance: get('performance') || attrs.performance || false,
          verbose: get('verbose') || attrs.verbose || false
        };
        return args;
      }
      element.modal(modalArgs());

      $scope.$watch(function() { return get('isActive'); }, function(newval) {
        if (!already) {
          if (get('isActive')) {
            element.modal('show');
          } else {
            element.modal('hide');
          }
        }
        already = false;
      });
    }
  };
})

.service('$modal', function() {
    
});
