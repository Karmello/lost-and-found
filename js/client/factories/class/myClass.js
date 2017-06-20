(function() {

	'use strict';

	var myClass = function(
		MySwitchable, MySwitcher, MyLoader, MyModal, MySrc, MyStorageItem, MyDataModel, MyCollectionBrowser, MySrcCollection,
		MyForm, MySrcAction
	) {

		return {
			MySwitchable: MySwitchable,
			MySwitcher: MySwitcher,
			MyLoader: MyLoader,
			MyModal: MyModal,
			MySrc: MySrc,
			MyStorageItem: MyStorageItem,
			MyDataModel: MyDataModel,
			MyCollectionBrowser: MyCollectionBrowser,
			MySrcCollection: MySrcCollection,
			MyForm: MyForm,
			MySrcAction: MySrcAction
		};
	};

	myClass.$inject = [
		'MySwitchable', 'MySwitcher', 'MyLoader', 'MyModal', 'MySrc', 'MyStorageItem', 'MyDataModel', 'MyCollectionBrowser',
		'MySrcCollection', 'MyForm', 'MySrcAction'
	];

	angular.module('appModule').factory('myClass', myClass);

})();