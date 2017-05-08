(function() {

	'use strict';

	var utilService = function() {

		var loadScript = function(url) {

			var script = document.createElement('script');
			script.type = 'application/javascript';
			script.async = true;
			script.src = url;
			document.body.appendChild(script);
		};

		var dataURItoBlob = function(dataURI) {

			// convert base64/URLEncoded data component to raw binary data held in a string
			var byteString;

			if (dataURI.split(',')[0].indexOf('base64') >= 0)
				byteString = atob(dataURI.split(',')[1]);
			else
				byteString = unescape(dataURI.split(',')[1]);

			// separate out the mime component
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

			// write the bytes of the string to a typed array
			var ia = new Uint8Array(byteString.length);

			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			var blob = new Blob([ia], { type: mimeString });
			return blob;
		};



		return {
			loadScript: loadScript,
			dataURItoBlob: dataURItoBlob
		};
	};



	utilService.$inject = [];
	angular.module('appModule').service('utilService', utilService);

})();