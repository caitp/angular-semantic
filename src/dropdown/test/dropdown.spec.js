describe('dropdown', function() {
  var $body, $compile, $controller, $document, $element, $parent, $scope, $timeout, ctrl;
  beforeEach(module('ui.semantic.dropdown'));
  beforeEach(inject(function(_$compile_, _$controller_, _$document_, _$rootScope_, _$timeout_) {
    $body = _$document_.find('body');
    $compile = _$compile_;
    $controller = _$controller_;
    $document = _$document_;
    $scope = _$rootScope_;
    $scope.data = {};
    $timeout = _$timeout_;
  }));
});
