angular.module('ui.semantic', [
  'ui.semantic.tpls',
  'ui.semantic.accordion',
  'ui.semantic.checkbox',
  'ui.semantic.modal'
]);
angular.module('ui.semantic.tpls', []);
angular.module('ui.semantic.accordion', []).directive('accordion', [
  '$timeout',
  '$parse',
  function ($timeout, $parse) {
    return {
      restrict: 'EA',
      scope: {
        onClose: '&',
        onOpen: '&',
        onChange: '&',
        active: '@'
      },
      transclude: true,
      replace: true,
      template: '<div ng-transclude></div>',
      controller: function () {
      },
      compile: function () {
        return function (scope, element, attrs) {
          scope.exclusive = attrs.exclusive && scope.$parent.$eval(attrs.exclusive);
          scope.collapsible = attrs.collapsible && scope.$parent.$eval(attrs.collapsible);
          scope.duration = attrs.duration && scope.$parent.$eval(attrs.duration);
          scope.easing = attrs.easing && scope.$parent.$eval(attrs.easing);
          element.addClass('ui').addClass('accordion');
          var unregister = scope.$watch('$$phase', function () {
              unregister();
              $(element).accordion({
                debug: attrs.debug || false,
                performance: attrs.performance || false,
                verbose: attrs.verbose || false,
                exclusive: scope.exclusive,
                collapsible: scope.collapsible,
                duration: scope.duration,
                easing: scope.easing,
                onClose: function () {
                  scope.onClose({ 'active': $(this) });
                },
                onOpen: function () {
                  scope.onOpen({ 'active': $(this) });
                },
                onChange: function () {
                  scope.onChange({ 'active': $(this) });
                }
              });
            });
        };
      }
    };
  }
]);
(function () {
  var module = angular.module('ui.semantic.checkbox', []);
  angular.forEach([
    'checkbox',
    'slider',
    'toggle'
  ], function (name, _) {
    var needCheckbox = name !== 'checkbox' ? 'checkbox ' : '', inputType = name !== 'radio' ? 'checkbox' : 'radio';
    module.directive(name, [
      '$compile',
      '$parse',
      '$timeout',
      function ($compile, $parse, $timeout) {
        var directive = {
            restrict: 'EA',
            replace: true,
            require: 'ngModel',
            template: '<div class="ui ' + needCheckbox + name + '"><label></label></div>',
            link: function (scope, element, attrs, ctrl) {
              var callbacks = {}, unregister, n = 0, model, context = scope, $getter = $parse(attrs.ngModel), $setter = $getter.assign, $input = $('<input type="' + inputType + '" ' + 'ng-model="' + attrs.ngModel + '">');
              $input = $compile($input)(scope);
              element.prepend($input);
              scope.$watch(attrs.ngModel, function (newval) {
                if (angular.isString(newval) && newval.length) {
                  $getter = $parse(newval);
                  $setter = $getter.assign;
                }
              });
              angular.forEach([
                'onEnable',
                'onDisable',
                'onChange'
              ], function (name) {
                scope.$watch(function () {
                  return attrs[name];
                }, function (newval) {
                  callbacks[name] = callback(newval);
                });
              });
              angular.forEach([
                'onChange',
                'onEnable',
                'onDisable'
              ], function (name) {
                callbacks[name] = callback(attrs[name]);
                attrs.$observe(name, function () {
                  callbacks[name] = callback(attrs[name]);
                });
              });
              function callback(attr) {
                if (angular.isDefined(attr)) {
                  return $parse(attr);
                } else {
                  return function () {
                  };
                }
              }
              element.checkbox({
                verbose: attrs.verbose || false,
                debug: attrs.debug || false,
                performance: attrs.performance || false,
                onEnable: function () {
                  if (!$getter(context)) {
                    $setter(context, true);
                  }
                  scope.$evalAsync(function (scope) {
                    callbacks.onEnable(context, { checked: true });
                  });
                },
                onDisable: function () {
                  if ($getter(context)) {
                    $setter(context, false);
                  }
                  scope.$evalAsync(function (scope) {
                    callbacks.onDisable(context, { checked: false });
                  });
                },
                onChange: function () {
                  scope.$evalAsync(function (scope) {
                    if (n++ === 0) {
                      callbacks.onChange(context, { checked: $getter(context) });
                      $timeout(function () {
                        n = 0;
                      });
                    }
                  });
                }
              });
              scope.$watch(function () {
                return $getter(context);
              }, function (value) {
                element.checkbox(value ? 'enable' : 'disable');
              });
            }
          };
        return directive;
      }
    ]);
  });
  function RadioGroupCtrl($scope, $originalScope, ngModel) {
    this.elements = [];
    this.name = '';
    $scope.n = 0;
    this.ngModel = ngModel;
    this.$scope = $scope;
    this.$originalScope = $originalScope;
    $scope.wait = function (cb) {
      $scope.$timeout(function () {
        $scope.n = 0;
      }, 0);
    };
  }
  RadioGroupCtrl.prototype.addElement = function (element) {
    if (!element || this.elements.indexOf(element) > -1) {
      return;
    }
    this.elements.push(element);
    if (!this.active) {
      this.active = element;
    }
  };
  RadioGroupCtrl.prototype.removeElement = function (element) {
    var index = this.elements.indexOf(element);
    if (index > -1) {
      this.elements.splice(index, 1);
    }
  };
  RadioGroupCtrl.prototype.setName = function (name) {
    this.name = name;
    this.$scope.$broadcast('radioGroupNameChanged', name);
  };
  RadioGroupCtrl.prototype.selectElement = function (element, value) {
    var $scope = this.$scope, $originalScope = this.$originalScope, onSelect = this.onSelect, last = this.active;
    if (this.active) {
      this.active.children('input')[0].checked = false;
    }
    element.children('input')[0].checked = true;
    this.active = element;
    this.$scope.$evalAsync(function () {
      $scope.valueChanged(value);
      if (onSelect && !$scope.n++) {
        $scope.wait();
        onSelect($originalScope, {
          selected: element,
          value: value
        });
      }
    });
  };
  module.directive('radioGroup', [
    '$controller',
    '$parse',
    '$timeout',
    function ($controller, $parse, $timeout) {
      return {
        restrict: 'EA',
        require: '?ngModel',
        link: {
          pre: function (originalScope, element, attrs, ngModel) {
            if (!ngModel) {
              return;
            }
            var $scope = originalScope.$new(), $getter = $parse(attrs.ngModel), $setter = $getter.assign;
            $scope.valueChanged = function (value) {
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
            $scope.$watch(attrs.name, function (newval) {
              ctrl.setName(newval);
            });
            originalScope.$watch(function () {
              return $getter(originalScope);
            }, function (value) {
              originalScope.$broadcast('radioGroupSelectionChanged', value);
            });
            originalScope.$watch(function () {
              return attrs.onSelect;
            }, function (value) {
              if (value) {
                ctrl.onSelect = $parse(value);
              } else {
                ctrl.onSelect = function () {
                };
              }
            });
            attrs.$observe('ngModel', function (newval) {
              if (angular.isString(newval) && newval.length) {
                $getter = $parse(newval);
                $setter = $getter.assign;
              }
            });
          }
        }
      };
    }
  ]).controller('RadioGroupCtrl', RadioGroupCtrl).directive('radio', function ($compile, $timeout) {
    return {
      restrict: 'EA',
      replace: true,
      require: '^radioGroup',
      template: '<div class="ui radio checkbox"><label></label></div>',
      scope: {
        value: '@',
        onSelect: '&'
      },
      link: function (scope, element, attrs, radioGroup) {
        var $input = $('<input type="radio" name="' + radioGroup.name + '"></input>'), n = 0;
        $input = $compile($input)(scope);
        element.prepend($input);
        scope.$on('radioGroupNameChanged', function (event, name) {
          $input.attr('name', name);
        });
        scope.$on('radioGroupSelectionChanged', function (event, value) {
          if (value == scope.value) {
            element.checkbox('enable');
          }
        });
        radioGroup.addElement(element);
        scope.$on('$destroy', function () {
          radioGroup.removeElement(element);
        });
        element.checkbox({
          debug: attrs.debug || false,
          performance: attrs.performance || false,
          verbose: attrs.verbose || false,
          onEnable: function () {
            radioGroup.selectElement(element, scope.value);
            if (!n++) {
              scope.onSelect({
                selected: element,
                value: scope.value
              });
              $timeout(function () {
                n = 0;
              });
            }
          }
        });
      }
    };
  });
}());
angular.module('ui.semantic.modal', []).directive('modal', function () {
  return {
    restrict: 'EA',
    template: '<div class="ui modal" ng-transclude></div>',
    transclude: true,
    replace: true,
    scope: {
      isActive: '=',
      offset: '@',
      context: '@',
      closable: '@',
      transition: '@',
      duration: '@',
      easing: '@',
      onShow: '&',
      onHide: '&',
      debug: '@',
      performance: '@',
      verbose: '@'
    },
    link: function (scope, element, attrs) {
      var inWatch = false;
      function or(value, ifUndefined) {
        if (angular.isDefined(value)) {
          return value;
        } else {
          return ifUndefined;
        }
      }
      var unregister = scope.$watch('$$phase', function () {
          unregister();
          element.modal({
            offset: or(scope.offset, 0),
            context: or(scope.context, 'body'),
            closable: or(scope.closable, true),
            transition: or(scope.transition, 'scale'),
            duration: or(scope.duration, 400),
            easing: or(scope.easing, 'easeOutExpo'),
            onShow: function () {
              if (!inWatch) {
                scope.isActive = true;
              }
              scope.onShow({ modal: $(this) });
            },
            onHide: function () {
              if (!inWatch) {
                scope.isActive = false;
              }
              scope.onHide({ modal: $(this) });
            },
            debug: or(scope.debug, false),
            performance: or(scope.performance, false),
            verbose: or(scope.verbose, false)
          });
          angular.forEach([
            'show',
            'hide',
            'toggle'
          ], function (name) {
            scope[name] = function () {
              element.modal(name);
            };
          });
          scope.$watch('isActive', function (newval) {
            inWatch = true;
            if (scope.isActive) {
              element.modal('show');
            } else {
              element.modal('hide');
            }
            inWatch = false;
          });
        });
    }
  };
}).service('$modal', function () {
});