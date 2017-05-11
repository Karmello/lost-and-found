(function() {

	'use strict';

	var MyCollectionSelector = function() {

		var MyCollectionSelector = function() {};

		MyCollectionSelector.prototype.selectAll = function() {

			for (var i = 0; i < this.collection.length; i++) {
				this.collection[i].isSelected = true;
			}
		};

		MyCollectionSelector.prototype.deselectAll = function() {

			for (var i = 0; i < this.collection.length; i++) {
				this.collection[i].isSelected = false;
			}
		};

		MyCollectionSelector.prototype.getSelectedCollection = function() {

			var selected = [];

			for (var i = 0; i < this.collection.length; i++) {
				if (this.collection[i].isSelected) { selected.push(this.collection[i]); }
			}

			return selected;
		};

		return MyCollectionSelector;
	};

	MyCollectionSelector.$inject = [];
	angular.module('appModule').factory('MyCollectionSelector', MyCollectionSelector);

})();