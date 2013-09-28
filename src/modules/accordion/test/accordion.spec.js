describe('accordion', function() {
  var $compile, $controller, $document, $element, $scope, $parent, ctrl;
  beforeEach(module('ui.semantic.accordion'));
  beforeEach(inject(function(_$compile_, _$controller_, _$document_, _$rootScope_) {
    $compile = _$compile_;
    $controller = _$controller_;
    $document = _$document_;
    $scope = _$rootScope_;
  }));

  describe('option', function() {
    $.each(['collapsible', 'duration', 'easing', 'exclusive'], function(_, attr) {
      describe('attribute ' + attr, function() {
        it('can be read from the parent scope', function() {
          $scope[attr + 'Value'] = Math.random();
          $element = $compile($('<accordion '+attr+'="'+ attr+'Value"></accordion>'))($scope);
          $scope.$digest();
          expect($element.scope()[attr]).toEqual($scope[attr+'Value']);
        });

        it('can be a literal value', function() {
          var value = Math.random();
          $element = $compile($('<accordion '+attr+'="'+value+'"></accordion>'))($scope);
          $scope.$digest();
          expect($element.scope()[attr]).toEqual(value);
        });

        it('is a 1-way binding', function() {
          var value = Math.random();
          $scope[attr + 'Value'] = value;
          $element = $compile($('<accordion '+attr+'="'+attr+'Value"></accordion>'))($scope);
          $scope.$digest();
          $element.scope()[attr] = 0;
          $scope.$digest();
          expect($scope[attr+'Value']).toEqual(value);
        });
      });
    });
  });

  describe('callback', function() {
    it('onChange fired on active content change', function() {
      // TODO
    });

    it('onClose fired on content close', function() {
      // TODO
    });

    it('onOpen fired on content open', function() {
      // TODO
    });

    $.each(['on-change', 'on-close', 'on-open'], function(_, cb) {
      var c = $.camelCase(cb);
      describe(c, function() {
        it('has the active slide as its context', function() {
          // TODO
        });
      });
    });
  });
});
