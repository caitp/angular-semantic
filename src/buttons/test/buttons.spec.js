describe('ui.semantic.buttons',function() {

  beforeEach(module('ui.semantic.buttons'));

  describe('seBtnCheckbox', function() {
    var elm, template, scope, $compile;

    it('should be able to work with default true/false model values', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;

      scope.model = false;
      template = '<button ng-model="model" se-btn-checkbox ></button>';
      elm = $compile(template)(scope);
      scope.$digest();
      expect(elm).not.toHaveClass('active');

      scope.model = true;
      scope.$digest();
      expect(elm).toHaveClass('active');
    }));

    it('should be able to bind custom true/false model values', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;

      scope.model = 0;
      template = '<button ng-model="model" se-btn-checkbox se-btn-true="1" se-btn-false="0"></button>';
      elm = $compile(template)(scope);
      scope.$digest();
      expect(elm).not.toHaveClass('active');

      scope.model = 1;
      scope.$digest();
      expect(elm).toHaveClass('active');
    }));

    it('should be able manage custom true/false model values changes', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;

      scope.model = 1;
      scope.myVal = 1;
      template = '<button ng-model="model" se-btn-checkbox se-btn-true="myVal"></button>';
      elm = $compile(template)(scope);

      scope.$digest();
      expect(elm).toHaveClass('active');
      expect(scope.model).toEqual(1);

      scope.model = 2;
      scope.myVal = 2;
      scope.$digest();
      expect(elm).toHaveClass('active');
      expect(scope.model).toEqual(2);
    }));

    it('should be able to toggle default true/false model values on click event', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;

      scope.model = false;
      template = '<button ng-model="model" se-btn-checkbox ></button>';
      elm = $compile(template)(scope);

      elm.click();
      expect(scope.model).toBe(true);
      expect(elm).toHaveClass('active');

      elm.click();
      expect(scope.model).toBe(false);
      expect(elm).not.toHaveClass('active');
    }));

    it('should be able toggle custom true/false model values on click event', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;

      scope.model = 0;
      template = '<button ng-model="model" se-btn-checkbox se-btn-true="1" se-btn-false="0"></button>';
      elm = $compile(template)(scope);

      elm.click();
      expect(scope.model).toBe(1);
      expect(elm).toHaveClass('active');

      elm.click();
      expect(scope.model).toBe(0);
      expect(elm).not.toHaveClass('active');
    }));

    it('should be able toggle custom active class on click event', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;

      scope.model = false;
      template = '<button ng-model="model" se-btn-checkbox se-btn-class="\'custom-class\'"></button>';
      elm = $compile(template)(scope);

      elm.click();
      expect(elm).toHaveClass('custom-class');

      elm.click();
      expect(elm).not.toHaveClass('custom-class');
    }));

    });

  describe('seBtnRadio', function() {
    var elm, template, scope, $compile;

    it('should be able to set active class according to model values', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;
      template = '<div ng-model="model" se-btn-radio="1"></div>' +
                 '<div ng-model="model" se-btn-radio="2"></div>' +
                 '<div ng-model="model" se-btn-radio="3"></div>';

      elm = $compile(template)(scope);
      scope.$digest();
      expect(elm.eq(0)).not.toHaveClass('active');
      expect(elm.eq(1)).not.toHaveClass('active');
      expect(elm.eq(2)).not.toHaveClass('active');

      scope.model = 1;
      scope.$digest();
      expect(elm.eq(0)).toHaveClass('active');
      expect(elm.eq(1)).not.toHaveClass('active');
      expect(elm.eq(2)).not.toHaveClass('active');

      scope.model = 3;
      scope.$digest();
      expect(elm.eq(2)).toHaveClass('active');
      expect(elm.eq(0)).not.toHaveClass('active');
      expect(elm.eq(1)).not.toHaveClass('active');
    }));

    it('should be able to update active state according to values', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;

      scope.btnValues = ['val1', 'val2'];
      template = '<div ng-model="model" se-btn-radio="btnValues[0]"></div>' +
                 '<div ng-model="model" se-btn-radio="btnValues[1]"></div>';

      elm = $compile(template)(scope);
      scope.$digest();
      expect(elm.eq(0)).not.toHaveClass('active');
      expect(elm.eq(1)).not.toHaveClass('active');

      scope.model = 'val2';
      scope.$digest();
      expect(elm.eq(0)).not.toHaveClass('active');
      expect(elm.eq(1)).toHaveClass('active');

      scope.btnValues[0] = 'val3';
      scope.model = 'val3';
      scope.$digest();

      expect(elm.eq(0)).toHaveClass('active');
      expect(elm.eq(1)).not.toHaveClass('active');

    }));

    it('should be able to set active class and model value on click event', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;

      template = '<div ng-model="model" se-btn-radio="1"></div>' +
                 '<div ng-model="model" se-btn-radio="2"></div>' +
                 '<div ng-model="model" se-btn-radio="3"></div>';

      elm = $compile(template)(scope);
      scope.$digest();
      elm.eq(0).click();
      expect(elm.eq(0)).toHaveClass('active');
      expect(elm.eq(1)).not.toHaveClass('active');
      expect(elm.eq(2)).not.toHaveClass('active');
      expect(scope.model).toBe(1);

      elm.eq(2).click();
      expect(elm.eq(2)).toHaveClass('active');
      expect(elm.eq(0)).not.toHaveClass('active');
      expect(elm.eq(1)).not.toHaveClass('active');
      expect(scope.model).toBe(3);

    }));

    it('should be able to set custom active class on click event', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;

      template = '<div ng-model="model" se-btn-radio="1" se-btn-class="\'custom-class\'"></div>' +
                 '<div ng-model="model" se-btn-radio="2" se-btn-class="\'custom-class\'"></div>';

      elm = $compile(template)(scope);
      scope.$digest();
      elm.eq(0).click();
      expect(elm.eq(0)).toHaveClass('custom-class');
      expect(elm.eq(1)).not.toHaveClass('custom-class');

      elm.eq(1).click();
      expect(elm.eq(0)).not.toHaveClass('custom-class');
      expect(elm.eq(1)).toHaveClass('custom-class');

    }));

    it('should be able to save active state and model value even if the same element was clicked a few times', inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;

      template = '<div ng-model="model" se-btn-radio="1" se-btn-class="\'custom-class\'"></div>' +
                 '<div ng-model="model" se-btn-radio="2" se-btn-class="\'custom-class\'"></div>';

      elm = $compile(template)(scope);
      scope.$digest();
      elm.eq(0).click();
      expect(elm.eq(0)).toHaveClass('custom-class');
      expect(elm.eq(1)).not.toHaveClass('custom-class');
      expect(scope.model).toBe(1);

      elm.eq(0).click();
      expect(elm.eq(0)).toHaveClass('custom-class');
      expect(elm.eq(1)).not.toHaveClass('custom-class');
      expect(scope.model).toBe(1);

    }));
  });
});