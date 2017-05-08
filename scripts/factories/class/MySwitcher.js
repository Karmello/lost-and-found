(function() {

	'use strict';

	var MySwitcher = function() {

		var MySwitcher = function(config, parent) {

			Object.assign(this, config);
			this.parent = parent;
		};



		MySwitcher.prototype.activate = function(skipOnActivatedCb) {

			this.parent.activeSwitcherId = this._id;
			if (!skipOnActivatedCb && this.onActivate) { this.onActivate(); }
		};



		return MySwitcher;
	};



	MySwitcher.$inject = [];
	angular.module('appModule').factory('MySwitcher', MySwitcher);

})();