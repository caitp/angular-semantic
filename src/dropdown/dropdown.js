(function() {

function DropdownController($scope, $element, $attrs, $injector, $interpolate, $rootScope) {
  var self = this, prop,
      $animate = $injector.get('$animate'),
      $document = $injector.get('$document');
  this._animate = $animate;
  this._document = $document;
  this.menus = [];
  this._menuElements = [];
  this._element = $element;
  this._rootScope = $rootScope;
  this._trigger = $interpolate($attrs.on || 'click', false)($scope);
  this._transition = $interpolate($attrs.transition || 'slide down', false)($scope);
  this._hidden = true;
  this._transitioning = false;
  this.event = {
    test: {
      toggle: function(event) {
        if (!self.isVisible(self._menu)) {
          self.show();
        } else {
          self.hide();
        }
      },
      touch: function(event) {
        
      },
      hide: function(event) {
        event.preventDefault();
        event.stopPropagation();
        self.hide();
      }
    },
    rootScope: {
      '$dropdownHideOthers': function(event, ctrl) {
        if (ctrl === self) {
          return;
        }
        self.hide();
      }
    }
  };

  if (this._trigger === 'click') {
    $element.on('click', this.event.test.toggle);
  } else if (this._trigger === 'hover') {
    $element.on('mouseenter', this.event.test.touch);
    $element.on('mouseleave', this.event.test.touch);
  } else {
    $element.on(this._trigger, this.event.test.toggle);
  }

  for (prop in this.event.rootScope) {
    var item = this.event.rootScope[prop];
    if (typeof item === 'function') {
      item.unregister = $rootScope.$on(prop, item);
    }
  }
  $scope.$on('$destroy', function() {
    for (var prop in this.event.rootScope) {
      var item = this.event.rootScope[prop];
      if (typeof item === 'function' && typeof item.unregister === 'function') {
        item.unregister();
      }
    }
  });
}

DropdownController.prototype = {
  constructor: DropdownController,
  addMenu: function(menu) {
    if (menu && menu.constructor === DropdownMenuController && this.menus.indexOf(menu) < 0) {
      this.menus.push(menu);
      this._menuElements.push(menu.get()[0]);
      this._menu = angular.element(this._menuElements);
      menu.dropdown = this;
    }
  },
  removeMenu: function(menu) {
    var index = this.menus.indexOf(menu);
    if (index >= 0) {
      menu.dropdown = undefined;
      this.menus.splice(index, 1);
      this._menuElements.splice(index, 1);
      this._menu = angular.element(this._menuElements);
    }
  },
  hideOthers: function() {
    this._rootScope.$emit('$dropdownHideOthers', this);
  },
  show: function(done) {
    var $current = this._element, $animate = this._animate, self = this,
        animate = $animate && $animate.enabled() === true && self._transition !== 'none';
    if (typeof done !== 'function') {
      done = function() {};
    }
    function finish() {
      if (animate) {
        self._menu.removeClass(self._transition + ' transition in');
      }
      self._menu.removeClass('hidden').addClass('visible');
      $current.addClass('visible');
      setTimeout(function() {
        self._document.on('click', self.event.test.hide);
      });
      self._hidden = false;
      self._transitioning = false;
      done();
    }
    if (!self.isVisible() && !self._transitioning) {
      self._transitioning = true;
      self.hideOthers();
      $current.addClass('active');
      if (animate) {
        $animate.addClass(self._menu, self._transition + ' visible transition in', finish);
      } else {
        finish();
      }
    }
  },
  hide: function(done) {
    var $current = this._element, $animate = this._animate, self = this,
        animate = $animate && $animate.enabled() === true && self._transition !== 'none';
    if (typeof done !== 'function') {
      done = function() {};
    }
    function finish() {
      self._menu.removeClass(self._transition + ' transition out visible').addClass('hidden');
      $current.removeClass('visible');
      setTimeout(function() {
        self._document.off('click', self.event.test.hide);
      });
      self._hidden = true;
      self._transitioning = false;
      done();
    }
    if (self.isVisible() && !self._transitioning) {
      self._transitioning = true;
      $current.removeClass('active');
      if (animate) {
        $animate.addClass(self._menu, self._transition + ' transition out', finish);
      } else {
        finish();
      }
    }
  },
  determineAction: function(text, value) {
  },
  determineIntent: function(event, callback) {
    callback = callback || angular.noop;
  },
  isVisible: function() {
    return !this._hidden;
  }
};

var dropdownController = [
  '$scope', '$element', '$attrs', '$injector', '$interpolate', '$rootScope', DropdownController
];

function DropdownMenuController($scope, $element, $attrs) {
  var self = this;
  this._element = $element;
  $scope.$on('$destroy', function() {
    this.dropdown.removeMenu(self);
  });
}

DropdownMenuController.prototype = {
  constructor: DropdownMenuController,
  addToDropdown: function(dropdown) {
    if (dropdown && dropdown.constructor === DropdownController) {
      dropdown.addMenu(this);
    }
  },
  get: function() {
    return this._element;
  }
};

var dropdownMenuController = ['$scope', '$element', '$attrs', DropdownMenuController];

angular.module('ui.semantic.dropdown', [])

.controller('DropdownController', dropdownController)
.controller('DropdownMenuController', dropdownMenuController)
.directive('dropdown', function() {
  return {
    restrict: 'EA',
    template: '<div class="ui dropdown"></div>',
    replace: true,
    transclude: true,
    controller: 'DropdownController',
    compile: function(element, attr, $transclude) {
      return function(scope, element, attr, ctrl) {
        $transclude(scope, function(dom) {
          element.append(dom);
        });
        element.removeClass('ng-scope');
        angular.forEach(element.children(), function(element) {
          angular.element(element).removeClass('ng-scope');
        });
      };
    }
  };
})

.directive('dropdownMenu', function() {
  return {
    restrict: 'EA',
    template: '<div class="ui menu hidden"></div>',
    require: ['^dropdown', 'dropdownMenu'],
    replace: true,
    transclude: true,
    controller: 'DropdownMenuController',
    compile: function(element, attr, $transclude) {
      return function(scope, element, attr, ctrls) {
        ctrls[0].addMenu(ctrls[1]);
        attr.$removeClass('ng-scope');
        $transclude(scope, function(dom) {
          element.append(dom);
        });
        angular.forEach(element.children(), function(element) {
          angular.element(element).removeClass('ng-scope');
        });
      };
    }
  };
})

.directive('dropdownItem', function() {
  return {
    restrict: 'EA',
    template: '<div class="item"></div>',
    link: function(scope, element, attr) {
      element.removeClass('ng-scope');
      angular.forEach(element.children(), function(element) {
        angular.element(element).removeClass('ng-scope');
      });
    }
  };
});

})();