describe('checkbox', function() {
  var $body, $compile, $controller, $document, $element, $parent, $scope, $timeout, ctrl;
  beforeEach(module('ui.semantic.checkbox'));
  beforeEach(inject(function(_$compile_, _$controller_, _$document_, _$rootScope_, _$timeout_) {
    $body = _$document_.find('body');
    $compile = _$compile_;
    $controller = _$controller_;
    $document = _$document_;
    $scope = _$rootScope_;
    $scope.data = {};
    $timeout = _$timeout_;
  }));

  $.each(['checkbox', 'slider', 'toggle'], function(_, name) {
    var wait = 100;

    describe(name + ' (element)', function() {
      it('appends an <input type="checkbox"> element as a child', function() {
        $scope.data.checked = true;
        $element = $compile($('<'+name+' ng-model="data.checked">'))($scope);
        $scope.$digest();
        expect($element.find('input').length).toEqual(1);
        expect($element.find('input').prop('type')).toEqual('checkbox');
      });

      it('is data-bound with ng-model', function() {
        $scope.data.checked = true;
        $element = $compile($('<'+name+' ng-model="data.checked">'))($scope);
        $scope.$digest();
        expect($element.find('input').prop('checked')).toEqual(true);

        $scope.data.checked = false;
        $scope.$digest();
        expect($element.find('input').prop('checked')).toEqual(false);

        $scope.data.checked = true;
        $scope.$digest();
        expect($element.find('input').prop('checked')).toEqual(true);
      });

      it('model is toggled when input is clicked', function() {
        $scope.data.checked = true;
        $element = $compile($('<'+name+' ng-model="data.checked">'))($scope);
        $scope.$digest();
        $element.find('input').trigger('click');
        $scope.$digest();
        waitsFor(function() {
          if ($scope.data.checked === false) {
            return true;
          }
        }, 'model to change after click', 500);
        runs(function() {
          expect($scope.data.checked).toEqual(false);
          $element.find('input').trigger('click');
          $scope.$digest();
          waitsFor(function() {
            if ($scope.data.checked === true) {
              return true;
            }
          }, 'model to change after click', 500);
          runs(function() {
            expect($scope.data.checked).toEqual(true);
          });
        });
      });

      it('retains element class attribute', function() {
        $element = $compile($('<'+name+' class="basic" ng-model="data.checked"></'+name+'>'))
          ($scope);
        $scope.$digest();
        expect($element).toHaveClass('basic');
      });

      it('retains element id attribute', function() {
        $element = $compile($('<'+name+' id="test" ng-model="data.checked"></'+name+'>'))($scope);
        $scope.$digest();
        expect($element[0].id).toEqual('test');
      });
    });
    
    describe(name + ' (attribute)', function() {
      it('appends an <input type="checkbox"> element as a child', function() {
        $scope.data.checked = true;
        $element = $compile($('<div '+name+' ng-model="data.checked">'))($scope);
        $scope.$digest();
        expect($element.find('input').length).toEqual(1);
        expect($element.find('input').prop('type')).toEqual('checkbox');
      });

      it('is data-bound with ng-model', function() {
        $scope.data.checked = true;
        $element = $compile($('<div '+name+' ng-model="data.checked">'))($scope);
        $scope.$digest();
        expect($element.find('input').prop('checked')).toEqual(true);

        $scope.data.checked = false;
        $scope.$digest();
        expect($element.find('input').prop('checked')).toEqual(false);

        $scope.data.checked = true;
        $scope.$digest();
        expect($element.find('input').prop('checked')).toEqual(true);
      });

      it('model is toggled when input is clicked', function() {
        $scope.data.checked = true;
        $element = $compile($('<div '+name+' ng-model="data.checked">'))($scope);
        $scope.$digest();
        $element.find('input').trigger('click');
        $scope.$digest();
        waitsFor(function() {
          if ($scope.data.checked === false) {
            return true;
          }
        }, 'model to change after click', 500);
        runs(function() {
          expect($scope.data.checked).toEqual(false);
          $element.find('input').trigger('click');
          $scope.$digest();
          waitsFor(function() {
            if ($scope.data.checked === true) {
              return true;
            }
          }, 'model to change after click', 500);
          runs(function() {
            expect($scope.data.checked).toEqual(true);
          });
        });
      });

      it('retains element class attribute', function() {
        $element = $compile($('<div '+name+' class="basic" ng-model="data.checked"></'+name+'>'))
          ($scope);
        $scope.$digest();
        expect($element).toHaveClass('basic');
      });

      it('retains element id attribute', function() {
        $element = $compile($('<div '+name+' id="test" ng-model="data.checked"></'+name+'>'))($scope);
        $scope.$digest();
        expect($element[0].id).toEqual('test');
      });
    });
  });
});