angular.module('appModule').directive('formActionBtns', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/formActionBtns.html',
    transclude: true,
    scope: {
      myForm: '='
    },
    controller: function($scope) {

      var clearBtnForms = [
        'loginForm', 'registerForm', 'recoverForm', 'passwordForm', 'deactivationForm', 'reportSearchForm',
        'contactForm', 'editReportForm', 'commentsForm', 'commentsReplyForm'
      ];

      var resetBtnForms = ['regionalForm', 'appearanceForm', 'personalDetailsForm', 'editReportForm', 'addReportForm', 'upgradeForm', 'respondToReportForm'];

      var cancelBtnForms = ['editReportForm', 'addReportForm', 'respondToReportForm'];

      $scope.myForm.showClearBtn = clearBtnForms.indexOf($scope.myForm.ctrlId) > -1;
      $scope.myForm.showResetBtn = resetBtnForms.indexOf($scope.myForm.ctrlId) > -1;
      $scope.myForm.showCancelBtn = cancelBtnForms.indexOf($scope.myForm.ctrlId) > -1;

      switch ($scope.myForm.ctrlId) {

        case 'addReportForm':
        case 'editReportForm':
        case 'respondToReportForm':
          $scope.myForm.submitBtnPhraseIndex = 4;
          break;

        case 'loginForm':
        case 'registerForm':
        case 'recoverForm':
          $scope.myForm.submitBtnPhraseIndex = 3;
          break;

        case 'contactForm':
        case 'commentsForm':
        case 'commentsReplyForm':
          $scope.myForm.submitBtnPhraseIndex = 4;
          break;

        case 'regionalForm':
        case 'appearanceForm':
        case 'personalDetailsForm':
        case 'passwordForm':
          $scope.myForm.submitBtnPhraseIndex = 5;
          break;

        case 'reportSearchForm':
          $scope.myForm.submitBtnPhraseIndex = 17;
          break;

        case 'upgradeForm':
          $scope.myForm.submitBtnPhraseIndex = 36;
          break;
      }



      $scope.onSubmit = function() { $scope.myForm.submit(); };
      $scope.onClear = function() { $scope.myForm.clear(); };
      $scope.onReset = function() { $scope.myForm.reset(); };
      $scope.onCancel = function() { $scope.myForm.onCancel(); };
    },
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {


      };
    }
  };
});