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

      it('model is toggled when clicked', function() {
        $scope.data.checked = true;
        $element = $compile($('<'+name+' ng-model="data.checked">'))($scope);
        $scope.$digest();
        $element.trigger('click');
        expect($scope.data.checked).toEqual(false);
        $element.trigger('click');
        expect($scope.data.checked).toEqual(true);
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

      $.each(['on-change', 'on-enable', 'on-disable'], function(_, attr) {
        var cb = $.camelCase(attr);
        it(cb + ' event evaluates expr with checked value', function() {
          var startWith = attr === 'on-enable' ? false : true,
              expected = attr === 'on-change' ? startWith : !startWith,
              called = false,
              callback = $scope[cb] = jasmine.createSpy(cb);
          $scope.data = startWith;
          $element = $compile('<'+name+' ng-model="data" ' + attr + '="'+cb+'(checked)"></'+
                              name+'>')($scope);
          $scope.$digest();
          callback.reset();
          $scope.$apply(function() { $scope.data = !startWith; });
          expect(callback).toHaveBeenCalledWith(expected);
          expect(callback.callCount).toEqual(1);
        });
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

      it('model is toggled when clicked', function() {
        $scope.data.checked = true;
        $element = $compile('<div '+name+' ng-model="data.checked">')($scope);
        $scope.$digest();
        $element.trigger('click');
        expect($scope.data.checked).toEqual(false);
        $element.trigger('click');
        expect($scope.data.checked).toEqual(true);
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

      $.each(['on-change', 'on-enable', 'on-disable'], function(_, attr) {
        var cb = $.camelCase(attr);
        it(cb + ' event evaluates expr with checked value', function() {
          var startWith = attr === 'on-enable' ? false : true,
              expected = attr === 'on-change' ? startWith : !startWith,
              called = false,
              callback = $scope[cb] = jasmine.createSpy(cb);
          $scope.data = startWith;
          $element = $compile($('<div '+name+' ng-model="data" ' + attr + '="'+cb+'(checked)">'+
                              '</div>'))($scope);
          $scope.$digest();
          callback.reset();
          $scope.$apply(function() { $scope.data = !startWith; });
          expect($scope[cb]).toHaveBeenCalledWith(expected);
          expect($scope[cb].callCount).toEqual(1);
        });
      });
    });
  });

  describe('radio', function() {
    describe('radio (element)', function() {
      it('must be the child of a radio-group', function() {
        $element = $('<radio></radio>');
        expect(angular.bind($scope,$compile($element), $scope)).toThrow();
      });

      it('must be the child of a radio-group with a model', function() {
        $element = $('<radio-group><radio></radio></radio-group>');
        $compile = $compile($element);
        expect($compile).toThrow();
      });

      it('appends an <input type="radio"> element as a child', function() {
        $scope.data.sel = true;
        $element = $compile($('<radio-group ng-model="data.sel"><radio /></radio-group>'))($scope);
        $scope.$digest();
        expect($element.find('input').length).toEqual(1);
        expect($element.find('input').prop('type')).toEqual('radio');
      });

      it('is data-bound with ng-model', function() {
        var $r;
        $element = $('<radio-group ng-model="data.sel">' +
                      '<radio value="1"></radio>' +
                      '<radio value="2"></radio>' +
                     '</radio-group>');
        $element = $compile($element)($scope);
        $scope.$digest();
        $r = $element.find('input');
        $scope.data.sel = "1";
        $scope.$digest();
        expect($r[0].checked).toEqual(true);
        expect($r[1].checked).toEqual(false);
        $scope.data.sel = "2";
        $scope.$digest();
        expect($r[0].checked).toEqual(false);
        expect($r[1].checked).toEqual(true);
      });

      it('changes selection on click', function() {
        var $r;
        $element = $('<radio-group ng-model="data.sel">' +
                      '<radio value="1"></radio>' +
                      '<radio value="2"></radio>' +
                     '</radio-group>');
        $element = $compile($element)($scope);
        $scope.$digest();
        $r = $element.find('input');
        $($r[0]).trigger('click');
        expect($r[0].checked).toEqual(true);
        expect($r[1].checked).toEqual(false);
        $($r[1]).trigger('click');
        expect($r[0].checked).toEqual(false);
        expect($r[1].checked).toEqual(true);
      });

      it('radio-group on-select event evaluates expr with selected element and value', function() {
        var onSelect = $scope.onSelect = jasmine.createSpy('onSelect');
        $element = $('<radio-group name="test" on-select="onSelect(selected, value)" ' +
                      'ng-model="data.sel">' +
                      '<radio value="1"></radio>' +
                      '<radio value="2"></radio>' +
                      '</radio-group>');
        $element = $compile($element)($scope);
        $scope.$digest();
        expect(onSelect).toHaveBeenCalledWith(jasmine.any(Object), "1");
        expect(onSelect.callCount).toEqual(1);
        onSelect.reset();
        $scope.$apply(function() { $scope.data.sel = "2"; });
        expect(onSelect).toHaveBeenCalledWith(jasmine.any(Object), "2");
        expect(onSelect.callCount).toEqual(1);
        $scope.onSelect.reset();
        $scope.$apply(function() { $scope.data.sel = "1"; });
        expect(onSelect).toHaveBeenCalledWith(jasmine.any(Object), "1");
        expect(onSelect.callCount).toEqual(1);
      });

      it('radio on-select event evaluates expr with selected element and value', function() {
        var onSelect = $scope.onSelect = jasmine.createSpy('onSelect'),
            onSelect2 = $scope.onSelect2 = jasmine.createSpy('onSelect2');
        $element = $('<radio-group name="test" ' +
                      'ng-model="data.sel">' +
                      '<radio value="1" on-select="onSelect2(selected,value)"></radio>' +
                      '<radio value="2" on-select="onSelect(selected,value)"></radio>' +
                      '</radio-group>');
        $element = $compile($element)($scope);
        $scope.$digest();
        expect(onSelect2).toHaveBeenCalledWith(jasmine.any(Object), "1");
        expect(onSelect2.callCount).toEqual(1);
        onSelect2.reset();
        $scope.$apply(function() { $scope.data.sel = "2"; });
        expect(onSelect).toHaveBeenCalledWith(jasmine.any(Object), "2");
        expect(onSelect.callCount).toEqual(1);
        expect(onSelect2.callCount).toEqual(0);
        $scope.$apply(function() { $scope.data.sel = "1"; });
        expect(onSelect2).toHaveBeenCalledWith(jasmine.any(Object), "1");
        expect(onSelect2.callCount).toEqual(1);
        expect(onSelect.callCount).toEqual(1);
      });
    });

    describe('radio (attribute)', function() {
      it('must be the child of a radio-group', function() {
        $element = $('<div radio></div>');
        expect(angular.bind($scope,$compile($element), $scope)).toThrow();
      });

      it('must be the child of a radio-group with a model', function() {
        $element = $('<div radio-group><div radio></div></div>');
        $compile = $compile($element);
        expect($compile).toThrow();
      });

      it('appends an <input type="radio"> element as a child', function() {
        $scope.data.sel = true;
        $element = $compile($('<div radio-group ng-model="data.sel"><div radio /></div>'))($scope);
        $scope.$digest();
        expect($element.find('input').length).toEqual(1);
        expect($element.find('input').prop('type')).toEqual('radio');
      });

      it('is data-bound with ng-model', function() {
        var $r;
        $element = $('<div radio-group ng-model="data.sel" name="sel">' +
                      '<div radio value="1"></div>' +
                      '<div radio value="2"></div>' +
                     '</div>');
        $element = $compile($element)($scope);
        $scope.$digest();
        $r = $element.find('input');
        $scope.$apply(function() { $scope.data.sel = "1"; });
        expect($r[0].checked).toEqual(true);
        expect($r[1].checked).toEqual(false);
        $scope.$apply(function() { $scope.data.sel = "2"; });
        expect($r[0].checked).toEqual(false);
        expect($r[1].checked).toEqual(true);
      });

      it('changes selection on click', function() {
        var $r;
        $element = $('<div radio-group ng-model="data.sel">' +
                      '<div radio value="1"></div>' +
                      '<div radio value="2"></div>' +
                     '</div>');
        $element = $compile($element)($scope);
        $scope.$digest();
        $r = $element.find('input');
        $($r[0]).trigger('click');
        $scope.$digest();
        expect($r[0].checked).toEqual(true);
        expect($r[1].checked).toEqual(false);
        $($r[1]).trigger('click');
        $scope.$digest();
        expect($r[0].checked).toEqual(false);
        expect($r[1].checked).toEqual(true);
      });

      it('radio-group on-select event evaluates expr with selected element and value', function() {
        var onSelect = $scope.onSelect = jasmine.createSpy('onSelect');
        $element = $('<div radio-group name="test" on-select="onSelect(selected, value)" ' +
                      'ng-model="data.sel">' +
                      '<div radio value="1"></div>' +
                      '<div radio value="2"></div>' +
                      '</div>');
        $element = $compile($element)($scope);
        $scope.$digest();
        expect(onSelect).toHaveBeenCalledWith(jasmine.any(Object), "1");
        expect(onSelect.callCount).toEqual(1);
        $scope.onSelect.reset();
        $scope.$apply(function() { $scope.data.sel = "2"; });
        expect(onSelect).toHaveBeenCalledWith(jasmine.any(Object), "2");
        expect(onSelect.callCount).toEqual(1);
        $scope.onSelect.reset();
        $scope.$apply(function() { $scope.data.sel = "1"; });
        expect(onSelect).toHaveBeenCalledWith(jasmine.any(Object), "1");
        expect(onSelect.callCount).toEqual(1);
      });

      it('radio on-select event evaluates expr with selected element and value', function() {
        var onSelect = $scope.onSelect = jasmine.createSpy('onSelect'),
            onSelect2 = $scope.onSelect2 = jasmine.createSpy('onSelect2');
        $element = '<div radio-group name="test" ' +
                      'ng-model="data.sel">' +
                      '<div radio value="1" on-select="onSelect2(selected,value)"></div>' +
                      '<div radio value="2" on-select="onSelect(selected,value)"></div>' +
                    '</div>';
        $element = $compile($element)($scope);
        $scope.$digest();
        expect(onSelect2).toHaveBeenCalledWith(jasmine.any(Object), "1");
        expect(onSelect2.callCount).toEqual(1);
        expect(onSelect.callCount).toEqual(0);
        $scope.$apply(function() { $scope.data.sel = "2"; });
        expect(onSelect).toHaveBeenCalledWith(jasmine.any(Object), "2");
        expect(onSelect.callCount).toEqual(1);
        expect(onSelect2.callCount).toEqual(1);
        $scope.$apply(function() { $scope.data.sel = "1"; });
        expect(onSelect2).toHaveBeenCalledWith(jasmine.any(Object), "1");
        expect(onSelect2.callCount).toEqual(2);
        expect(onSelect.callCount).toEqual(1);
      });
    });
  });
});