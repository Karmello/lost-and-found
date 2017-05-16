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
			accountRequiredModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.status[5],
				message: hardData.rejections[0]
			}),
			tryAgainLaterModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.status[6],
				message: hardData.rejections[1]
			}),
			tryToRefreshModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.status[6],
				message: hardData.rejections[7]
			}),
			passResetDoneModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.labels[4],
				message: hardData.information[2]
			}),
			deactivationDoneModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.count[7],
				message: hardData.information[6]
			}),
			confirmProceedModal: new MyModal({
				typeId: 'confirmModal',
				message: hardData.warnings[0]
			}),
			confirmDeactivationModal1: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.labels[24],
				message: hardData.warnings[1]
			}),
			confirmDeactivationModal2: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.labels[24],
				message: hardData.warnings[3]
			}),
			deleteReportModal: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.labels[28]
			})
		};
	};

	modalsConf.$inject = ['hardDataService', 'MyModal'];
	angular.module('appModule').service('modalsConf', modalsConf);

})();