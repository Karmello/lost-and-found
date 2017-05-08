(function() {

	'use strict';

	var MySrcAction = function($rootScope, $q) {

		var MySrcAction = function(config) {

			if (config) {
				this.acceptedFiles = config.acceptedFiles;
				this.maxFiles = config.maxFiles;
				this.maxFileSize = config.maxFileSize;
				this.getFilesCount = config.getFilesCount;
			}
		};

		MySrcAction.prototype.validate = function(actionId, data) {

			var that = this;

			switch(actionId) {

				case 'updateSingle':

					return $q(function(resolve) {

						var validFileTypes = that.getValidFileTypes();

						// Checking if number of files to upload is proper
						if (data.length == 1) {

							// Validating file extension
							if (validFileTypes.indexOf(data[0].type) == -1) {
								resolve({ success: false, msgId: 'WRONG_FILE_TYPE' });
								return;
							}

							// Validating file size
							if (data[0].size > that.maxFileSize) {
								resolve({ success: false, msgId: 'FILE_TOO_LARGE' });
								return;
							}

							resolve({ success: true });

						} else { resolve({ success: false, msgId: 'UPLOADING_TOO_MANY_FILES' }); }
					});

				case 'addToSet':

					return $q(function(resolve) {

						// When any file chosen
						if (data && data.length > 0) {

							var uniqueInputFiles = _.uniqBy(data, 'name');

							// When no duplicates
							if (uniqueInputFiles.length == data.length) {

								var filesCount = that.getFilesCount();

								// When there is room for more files
								if (filesCount < that.maxFiles) {

									var maxToUpload = that.maxFiles - filesCount;

									// Checking if number of files to upload is proper
									if (data.length <= maxToUpload) {

										var validFileTypes = that.getValidFileTypes();

										// For each input file
										for (var i = 0; i < data.length; i++) {

											// Validating file extension
											if (validFileTypes.indexOf(data[i].type) == -1) {
												resolve({ success: false, msgId: 'WRONG_FILE_TYPE' });
												return;
											}

											// Validating file size
											if (data[i].size > that.maxFileSize) {
												resolve({ success: false, msgId: 'FILE_TOO_LARGE' });
												return;
											}
										}

										resolve({ success: true });

									} else { resolve({ success: false, msgId: 'UPLOADING_TOO_MANY_FILES' }); }

								} else { resolve({ success: false, msgId: 'MAX_FILES_UPLOADED' }); }

							} else { resolve({ success: false, msgId: 'INPUT_FILES_CONSISTS_OF_DUPLICATES' }); }

						} else { resolve({ success: false, msgId: 'NO_FILES_LOADED' }); }
					});

				case 'delete':

					return $q(function(resolve) { resolve({ success: true }); });

				default:

					return $q(function(resolve) { resolve({ success: false }); });
			}
		};

		MySrcAction.prototype.getValidFileTypes = function() {

			return this.acceptedFiles.split(',');
		};

		MySrcAction.prototype.displayModalMessage = function(msgId, acceptCb) {

			var username = $rootScope.globalFormModels.personalDetailsModel.getValue('username');

			var settings;

			switch (msgId) {

				case 'confirmDeletion':
					settings = { title: $rootScope.hardData.phrases[109], acceptCb: acceptCb };
					$rootScope.ui.modals.confirmProceedModal.show(settings);
					break;

				case 'MAX_FILES_UPLOADED':
					settings = { title: username, message: $rootScope.hardData.sentences[30] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'UPLOADING_TOO_MANY_FILES':
					settings = { title: username, message: $rootScope.hardData.sentences[31] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'filenameAlreadyExists':
					settings = { title: username, message: $rootScope.hardData.sentences[32] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'WRONG_FILE_TYPE':
					settings = { title: username, message: $rootScope.hardData.sentences[25] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'FILE_TOO_LARGE':
					settings = { title: username, message: $rootScope.hardData.sentences[26] + this.maxFileSize / 1024 / 1024 + ' Mb.' };
					$rootScope.ui.modals.infoModal.show(settings);
					break;
			}
		};

		MySrcAction.createFormDataObject = function(args, file) {

			var formData = new FormData();
			angular.forEach(args, function(value, key) { formData.append(key, value); });
			formData.append('file', file);

			return formData;
		};

		return MySrcAction;
	};

	MySrcAction.$inject = ['$rootScope', '$q'];
	angular.module('appModule').factory('MySrcAction', MySrcAction);

})();