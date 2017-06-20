(function() {

	'use strict';

	var MyModal = function($rootScope, $timeout) {

		var MyModal = function(config) {

			Object.assign(this, config);
		};

		MyModal.prototype.prepareToShow = function(args, cb) {

			var typeModal;

			if (this.typeId) {
				typeModal = $rootScope.ui.modals[this.typeId];
				typeModal.flush();
			}

			if (typeModal) {

				Object.assign(typeModal, this);
				Object.assign(typeModal, args);
				cb(typeModal);

			} else {

				Object.assign(this, args);
				cb(this);
			}
		};

		MyModal.prototype.show = function(args) {

			var that = this;

			that.prepareToShow(args, function(modalForShow) {

				if ($rootScope.isAnyModalOpen) {

					$('.modal').modal('hide');
					$timeout(function() { $('#' + modalForShow.id).modal('show'); }, modalForShow.timeout);

				} else {

					$timeout(function() { $('#' + modalForShow.id).modal('show'); });
				}
			});
		};

		MyModal.prototype.hide = function(cb) {

			$('#' + this.id).modal('hide');
			if (cb) { $timeout(function() { cb(); }, this.timeout); }
		};

		MyModal.prototype.accept = function() {

			var that = this;
			$('#' + that.id).modal('hide');
			if (that.acceptCb) { $timeout(function() { that.acceptCb(); }, that.timeout); }
		};

		MyModal.prototype.dismiss = function() {

			var that = this;
			$('#' + that.id).modal('hide');
			if (that.dismissCb) { $timeout(function() { that.dismissCb(); }, that.timeout); }
		};

		MyModal.prototype.flush = function() {

			var keys = Object.keys(this);

			for (var i in keys) {
				if (keys[i] != 'id') { this[keys[i]] = undefined; }
			}
		};

		MyModal.prototype.timeout = 500;

		return MyModal;
	};

	MyModal.$inject = ['$rootScope', '$timeout'];
	angular.module('appModule').factory('MyModal', MyModal);

})();