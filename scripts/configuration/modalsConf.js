(function() {

	'use strict';

	var modalsConf = function(hardDataService, MyModal) {

		var hardData = hardDataService.get();

		return {
			infoModal: new MyModal({
				id: 'infoModal'
			}),
			confirmModal: new MyModal({
				id: 'confirmModal'
			}),
			confirmDangerModal: new MyModal({
				id: 'confirmDangerModal'
			}),
			tryAgainLaterModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.phrases[57],
				message: hardData.sentences[20]
			}),
			tryToRefreshModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.phrases[57],
				message: hardData.sentences[34]
			}),
			passResetDoneModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.phrases[96],
				message: hardData.sentences[58]
			}),
			deactivationDoneModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.phrases[59],
				message: hardData.sentences[28]
			}),
			confirmProceedModal: new MyModal({
				typeId: 'confirmModal',
				message: hardData.sentences[18]
			}),
			confirmDeactivationModal1: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.phrases[56],
				message: hardData.sentences[14]
			}),
			confirmDeactivationModal2: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.phrases[56],
				message: hardData.sentences[15]
			}),
			deleteItemModal: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.phrases[65]
			})
		};
	};

	modalsConf.$inject = ['hardDataService', 'MyModal'];
	angular.module('appModule').service('modalsConf', modalsConf);

})();