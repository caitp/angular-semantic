describe('dropdown', function() {
  var $body, $compile, $controller, $document, $element, $parent, $scope, $timeout, ctrl;
  beforeEach(module('ui.semantic.dropdown'));
  beforeEach(inject(function(_$compile_, _$controller_, _$document_, _$rootScope_, _$timeout_) {
    $body = _$document_.find('body');
    $compile = _$compile_;
    $controller = _$controller_;
    $document = _$document_;
    $scope = _$rootScope_;
    $timeout = _$timeout_;
  }));
  afterEach(function() {
    $element = undefined;
  });

  it('should show on click', function() {
    $element = $compile('<div><div dropdown><div dropdown-menu></div></div></div>')($scope);
    $scope.$digest();
    var $dropdown = $element.children().eq(0),
        ctrl = $dropdown.controller('dropdown');
    spyOn(ctrl, 'show').and.callThrough();
    $dropdown.trigger('click');
    expect(ctrl.show).toHaveBeenCalled();
  });


  it('should hide on document click', function(done) {
    var i = 0;
    $element = $compile('<div><div dropdown><div dropdown-menu></div></div></div>')($scope);
    $scope.$digest();
    var $dropdown = $element.children().eq(0),
        ctrl = $dropdown.controller('dropdown');
    ctrl.show();
    spyOn(ctrl, 'hide').and.callThrough();
    setTimeout(function() {
      ctrl._document.trigger('click');
      expect(ctrl.hide).toHaveBeenCalled();
      done();
    }, 100);
  });


  it('should hide on self click', function(done) {
    var i = 0;
    $element = $compile('<div><div dropdown><div dropdown-menu></div></div></div>')($scope);
    $scope.$digest();
    var $dropdown = $element.children().eq(0),
        ctrl = $dropdown.controller('dropdown');
    ctrl.show();
    spyOn(ctrl, 'hide').and.callThrough();
    setTimeout(function() {
            $dropdown.trigger('click');
            expect(ctrl.hide).toHaveBeenCalled();
          done();
    }, 100);
  });

  it('should hide other dropdowns when opening', function() {
    $element = $compile('<div><div dropdown><div dropdown-menu></div></div>' +
                             '<div dropdown><div dropdown-menu></div></div></div>')($scope);
    $scope.$digest();
    var $dropdown1 = $element.children().eq(0),
        $dropdown2 = $element.children().eq(1),
        ctrl1 = $dropdown1.controller('dropdown'),
        ctrl2 = $dropdown2.controller('dropdown');
    spyOn(ctrl1, 'hide').and.callThrough();
    spyOn(ctrl2, 'hide').and.callThrough();
    ctrl1.show();
    ctrl1.hide.calls.reset();
    ctrl2.show();
    expect(ctrl1.hide).toHaveBeenCalled();
    ctrl2.hide.calls.reset();
    ctrl1.show();
    expect(ctrl2.hide).toHaveBeenCalled();
  });
});
