describe('accordion', function() {
  var $compile, $controller, $document, $element, $scope, $parent, ctrl;
  beforeEach(module('ui.semantic.accordion'));
  beforeEach(inject(function(_$compile_, _$controller_, _$document_, _$rootScope_) {
    $compile = _$compile_;
    $controller = _$controller_;
    $document = _$document_;
    $scope = _$rootScope_;
  }));

  describe('dom elements', function() {
    it('are preserved', function() {
      var $title = $('<div class="title"><h1>Test</h1></div>'),
          $content = $('<div class="content"><p>Content</p></div>'),
          $element = $('<accordion></accordion>');
      $compile($element.append($title).append($content))($scope);
      $scope.$digest();
      expect($element.children('.title').first().html()).toEqual($title.html());
      expect($element.children('.content').first().html()).toEqual($content.html());
    });
  });

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
    var active, inactive;
    beforeEach(function() {
      active = '<div class="title active"></div><div class="content active"></div>';
      inactive = '<div class="title"></div><div class="content"></div>';
    });
    it('onChange fired on active content change', function() {
      $scope.onchange = function() {};
      spyOn($scope, 'onchange');
      $element = $compile('<accordion duration="0" class="basic" on-change="onchange()">'+
        active+inactive+'</accordion>')($scope);
      $scope.$digest();
      $element.accordion('toggle', 0);
      expect($scope.onchange).toHaveBeenCalled();
    });

    it('onClose fired on content close', function() {
      $scope.onclose = function() {};
      spyOn($scope, 'onclose');
      $element = $compile('<accordion duration="0" exclusive="false" class="basic" ' +
        'on-close="onclose()">' + active+active+'</accordion>')($scope);
      $scope.$digest();
      $element.accordion('close', 0);
      expect($scope.onclose).toHaveBeenCalled();
    });

    it('onOpen fired on content open', function() {
      $scope.onopen = function() {};
      spyOn($scope, 'onopen');
      $element = $compile('<accordion duration="0" class="basic" on-open="onopen()">'+
        inactive+inactive+'</accordion>')($scope);
      $scope.$digest();
      $element.accordion('open', 1);
      expect($scope.onopen).toHaveBeenCalled();
    });

    $.each(['on-change', 'on-close', 'on-open'], function(_, cb) {
      var c = $.camelCase(cb);
      describe(c, function() {
        it('has the active slide as its context', function() {
          $scope[c] = function(active) {};
          spyOn($scope, c);
          $element = $compile('<accordion duration="0" class="basic" '+cb+'="'+c+'(active)">' +
                              active + inactive + '</accordion>')($scope);
          $scope.$digest();
          $element.accordion('close', 0);
          $element.accordion('open', 1);
          expect($scope[c]).toHaveBeenCalledWith(jasmine.any(Object));
        });
      });
    });
  });
});
