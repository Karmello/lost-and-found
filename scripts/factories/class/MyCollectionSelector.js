(function() {

	'use strict';

	var MyCollectionSelector = function() {

		var MyCollectionSelector = function() {};

		MyCollectionSelector.prototype.selectAll = function() {

			for (var i in this.collection) { this.collection[i].isSelected = true; }
		};

		MyCollectionSelector.prototype.deselectAll = function() {

			for (var i in this.collection) { this.collection[i].isSelected = false; }
		};

		MyCollectionSelector.prototype.getSelectedCollection = function() {

			var selected = [];

			for (var obj of this.collection) {
				if (obj.isSelected) { selected.push(obj); }
			}

			return selected;
		};

		return MyCollectionSelector;
	};

	MyCollectionSelector.$inject = [];
	angular.module('appModule').factory('MyCollectionSelector', MyCollectionSelector);

})();