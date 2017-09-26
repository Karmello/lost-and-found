(function() {

  'use strict';

  var appModule = angular.module('appModule');

  appModule.directive('myImgCropModal', function($rootScope, $window, $timeout, MySrcAction, MyModal, MyLoader) {

    var imgId = '#cropImg';
    var inputId = '#cropInput';

    var flushCropper = function(scope) {

      $(inputId).val(undefined);
      $(imgId).cropper('destroy');
      $(imgId).attr('src', '');
      scope.selectedFile = undefined;
    };

    var myImgCropModal = {
      restrict: 'E',
      templateUrl: 'public/templates/myImgCropModal.html',
      scope: {
        winTitle: '<',
        maxFileSize: '<'
      },
      controller: function($scope) {

        var srcAction = new MySrcAction({
          acceptedFiles: 'image/png,image/jpg,image/jpeg',
          maxFileSize: $scope.maxFileSize
        });

        $scope.myModal = new MyModal({ id: 'imgCropModal', title: $scope.winTitle });
        $scope.loader = new MyLoader();
        $scope.selectedFile = undefined;
        $scope.mode = 'crop';

        // Event methods
        $scope.onBrowseClick = function() {

          $(inputId).click();
        };

        $scope.onFileSelected = function(e) {

          if (e.target.files.length == 1) {

            srcAction.validate('updateSingle', [e.target.files[0]]).then(function(result) {

              if (result.success) {

                $scope.loader.start(false, function() {
                  $scope.selectedFile = e.target.files[0];
                  $scope.mode = 'crop';
                  $scope.$apply();
                  $(imgId).cropper('replace', URL.createObjectURL(e.target.files[0]));
                  $timeout(function() { $scope.loader.stop(); }, $scope.loader.minLoadTime);
                });

              } else { srcAction.displayModalMessage(result.msgId); }
            });
          }
        };

        $scope.onZoomInClick = function() {

          $(imgId).cropper('zoom', 0.1);
        };

        $scope.onZoomOutClick = function() {

          $(imgId).cropper('zoom', -0.1);
        };

        $scope.onRotateClick = function() {

          $(imgId).cropper('rotate', 90);
        };

        $scope.onResetClick = function() {

          $(imgId).cropper('reset');
        };

        $scope.onSwitchModeClick = function() {

          if ($scope.mode == 'crop') {
            $scope.mode = 'move';
            $(imgId).cropper('setDragMode', 'move');

          } else if ($scope.mode == 'move') {
            $scope.mode = 'crop';
            $(imgId).cropper('setDragMode', 'crop');
          }
        };
      },
      compile: function(elem, attrs) {

        return function(scope, elem, attrs) {

          // Creating display modal event
          scope.$on('displayMyImgCropModal', function(e, args) {

            flushCropper(scope);

            // Showing modal
            scope.myModal.show({
              acceptCb: function() {

                if (scope.selectedFile) {
                  var dataURI = $(imgId).cropper('getCroppedCanvas').toDataURL(scope.selectedFile.type);
                  args.acceptCb(dataURI);
                }
              }
            });

            // Cropper settings
            $(imgId).cropper({
              viewMode: 1,
              aspectRatio: 1,
              autoCropArea: 0.5,
              minCropBoxWidth: 50,
              minCropBoxHeight: 50,
              background: false
            });
          });

          // Window resize event
          angular.element($window).bind('resize', function() {

            if (scope.selectedFile) {
              $(imgId).cropper('replace', URL.createObjectURL(scope.selectedFile));
            }
          });
        };
      }
    };

    return myImgCropModal;
  });

})();