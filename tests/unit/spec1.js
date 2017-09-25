describe('spec1', function() {

  var scope, nestedScope;

  beforeEach(module('appModule'));

  // beforeEach(inject(function($rootScope, $controller) {

  //     scope = $rootScope.$new();
  //     nestedScope = scope.$new();

  //     $controller('MyController', { $scope: scope });
  //     $controller('MyNestedController', { $scope: nestedScope });
  // }));

  it('scope should be undefined', function() {

    expect(scope).toBe(undefined);
  });
});