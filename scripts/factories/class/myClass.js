(function() {

	'use strict';

	var myClass = function(
		MySwitchable, MySwitcher, MyLoader, MyModal, MyFile, MySrc, MyStorageItem, MyFormModel, MyCollectionBrowser,
		MySrcCollection, MyForm, MySrcAction
	) {

		return {
			MySwitchable: MySwitchable,
			MySwitcher: MySwitcher,
			MyLoader: MyLoader,
			MyModal: MyModal,
			MyFile: MyFile,
			MySrc: MySrc,
			MyStorageItem: MyStorageItem,
			MyFormModel: MyFormModel,
			MyCollectionBrowser: MyCollectionBrowser,
			MySrcCollection: MySrcCollection,
			MyForm: MyForm,
			MySrcAction: MySrcAction
		};
	};

	myClass.$inject = [
		'MySwitchable', 'MySwitcher', 'MyLoader', 'MyModal', 'MyFile', 'MySrc', 'MyStorageItem', 'MyFormModel',
		'MyCollectionBrowser', 'MySrcCollection', 'MyForm', 'MySrcAction'
	];

	angular.module('appModule').factory('myClass', myClass);

})();