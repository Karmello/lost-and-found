(function() {

  'use strict';

  var reportPhotosService = function($rootScope, $q, aws3Service, MySrcAction, ReportsRest, Restangular, URLS) {

    var self = {
      initSlidesCollection: function(scope) {

        scope.srcSlidesCollection.init(scope.report.photos, undefined, { doNotLoad: true });
      },
      uploadPhotos: function(actionId, scope, inputData, src) {

        // Validating input after choose
        scope.srcAction.validate(actionId, inputData).then(function(res) {

          // When action valid
          if (res.success) {

            // Preparing fileTypes array
            var fileTypes = [];

            for (var i in inputData) {
              if (inputData[i] instanceof File) { fileTypes.push(inputData[i].type); }
            }

            // Asking server for upload credentials for all files
            aws3Service.getCredentials('report_photo', { reportId: $rootScope.apiData.report._id, 'fileTypes': fileTypes }).then(function(res) {

              var args = {
                inputData: inputData,
                credentials: res.data,
                src: src,
                getReloadUrl: function(i) {
                  return self.constructPhotoUrl($rootScope.apiData.loggedInUser._id, $rootScope.apiData.report._id, res.data[i].awsFilename, true);
                }
              };

              switch (actionId) {

                case 'addToSet':

                  scope.srcThumbsCollection.addToSet(args, function(results) {
                    self.syncDb(scope, function() {
                      self.initSlidesCollection(scope);
                    });
                  });

                  break;

                case 'updateSingle':

                  scope.srcThumbsCollection.updateSingle(args, function(success) {

                    if (!success) { return; }

                    if ($rootScope.apiData.report.avatar == args.src.filename) {
                      $rootScope.apiData.report.avatar = res.data[0].awsFilename;
                    }

                    self.syncDb(scope, function() {
                      self.initSlidesCollection(scope);
                    });
                  });

                  break;
              }

            }, function(res) { $rootScope.ui.modals.tryAgainLaterModal.show(); });

            // When action invalid
          } else { scope.srcAction.displayModalMessage(res.msgId); }
        });
      },
      deletePhotos: function(flag, scope, src) {

        var collection;

        switch (flag) {

          case 'single':
            collection = [src];
            break;

          case 'multiple':
            collection = scope.srcThumbsCollection.getSelectedCollection();
            break;
        }

        scope.srcThumbsCollection.removeFromSet({ collection: collection }, function(results) {

          if (results.indexOf(true) > -1) {

            self.syncDb(scope, function() {
              self.initSlidesCollection(scope);
            });
          }
        });
      },
      makeSingleAws3UploadReq: function(args, i) {

        var src = this;

        return $q(function(resolve) {

          var credentials = args.credentials[i];
          var inputData = args.inputData[i];

          // Creating form data
          var formData = MySrcAction.createFormDataObject(credentials.awsFormData, inputData);

          // Uploading to s3
          aws3Service.makeRequest(credentials.awsUrl, formData).success(function(res) {

            // When whole upload ended successfully

            src.filename = credentials.awsFilename;
            src.size = inputData.size;

            var report = $rootScope.apiData.report;

            resolve({
              success: true,
              url: self.constructPhotoUrl(report.userId, report._id, src.filename, true)
            });

          }).error(function(res) {
            resolve({ success: false });
          });
        });
      },
      syncDb: function(scope, cb, args) {

        var isAvatarOk = false;
        var copy = Restangular.copy(scope.report);
        copy.photos = [];

        if (args && args.newAvatar) { copy.avatar = args.newAvatar; }

        for (var i in scope.srcThumbsCollection.collection) {

          copy.photos[i] = {
            filename: scope.srcThumbsCollection.collection[i].filename,
            size: scope.srcThumbsCollection.collection[i].size
          };

          if (copy.photos[i].filename == copy.avatar) { isAvatarOk = true; }
        }

        if (!isAvatarOk) { copy.avatar = undefined; }

        copy.put().then(function(res) {

          scope.report.avatar = res.data.avatar;
          scope.report.photos = res.data.photos;
          if (cb) { cb(true); }

        }, function(res) {

          $rootScope.ui.modals.tryAgainLaterModal.hideCb = function() {
            scope.srcThumbsCollection.init(scope.report.photos);
            self.initSlidesCollection(scope);
            $rootScope.ui.modals.tryAgainLaterModal.hideCb = undefined;
          };

          $rootScope.ui.modals.tryAgainLaterModal.show();
        });
      },
      constructPhotoUrl: function(userId, reportId, filename, useThumb) {

        if (!useThumb) {
          return URLS.AWS3_UPLOADS_BUCKET_URL + userId + '/reports/' + reportId + '/' + filename;

        } else {
          return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + userId + '/reports/' + reportId + '/' + filename;
        }
      }
    };

    return self;
  };

  reportPhotosService.$inject = ['$rootScope', '$q', 'aws3Service', 'MySrcAction', 'ReportsRest', 'Restangular', 'URLS'];
  angular.module('appModule').service('reportPhotosService', reportPhotosService);

})();