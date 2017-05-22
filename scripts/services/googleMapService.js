(function() {

	'use strict';

	var SAME_LOCATION_OFFSET = 0.000015;

	var googleMapService = function($q, $timeout, $state, reportsConf) {

		var service = this;

		service.geo = {
			allowed: undefined
		};

		service.singleReportMap = {
			init: function() {

				// if (!service.reportPlace || service.reportPlace.place_id != placeId) {

				// 	var map = new google.maps.Map(document.getElementById('reportMap'));

				// 	google.maps.event.addListener(map, 'idle', function() {
				// 		google.maps.event.trigger(map, 'resize');
				// 	});

				// 	$timeout(function() {

				// 		var geocoder = new google.maps.Geocoder();
				// 		var infowindow = new google.maps.InfoWindow();

				// 		geocoder.geocode({ 'placeId': placeId }, function(results, status) {

				// 			service.reportPlace = results[0];

				// 			map.setCenter(service.reportPlace.geometry.location);
				// 			map.setZoom(13);

				// 			var marker = new google.maps.Marker({
				// 				map: map,
				// 				position: service.reportPlace.geometry.location
				// 			});

				// 			marker.addListener('click', function() {
				// 				infowindow.setContent(service.reportPlace.formatted_address);
				// 				infowindow.open(map, marker);
				// 			});

				// 			$timeout(function() {
				// 				infowindow.setContent(service.reportPlace.formatted_address);
				// 				infowindow.open(map, marker);
				// 			}, 1000);
				// 		});

				// 	}, 1000);
				// }
			}
		};

		service.searchReportsMap = {
			init: function() {

				if (angular.isUndefined(service.geo.allowed)) {

					$q(function(resolve) {

						navigator.geolocation.getCurrentPosition(function(pos) {

							resolve({
								geoAllowed: true,
								coords: pos.coords
							});

						}, function() {

							resolve({
								geoAllowed: false,
								coords: { latitude: 0, longitude: 0 }
							});

						}, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });

					}).then(function(conf) {

						service.searchReportsMap.ins = new google.maps.Map(document.getElementById('reportsMap'), {
							center: new google.maps.LatLng(conf.coords.latitude, conf.coords.longitude),
							zoom: 5
						});

						service.geo.allowed = conf.geoAllowed;

						if (!service.searchReportsMap.markers) {
							service.searchReportsMap.addMarkers(reportsConf.searchCollectionBrowser.collection);
						}
					});

				} else {

					google.maps.event.trigger(service.searchReportsMap.ins, 'resize');
				}
			},
			addMarkers: function(collection) {

				if (angular.isDefined(service.geo.allowed)) {

					var i;

					// Clearing markers
					if (service.searchReportsMap.markerCluster) {
						service.searchReportsMap.markerCluster.clearMarkers();
					}

					// Resetting markers array
					service.searchReportsMap.markers = [];



					$timeout(function() {

						// Adding new markers
						for (i = 0; i < collection.length; i++) {
							service.searchReportsMap.addSingleMarker(collection, i);
						}

						// Creating clusters
						var map = service.searchReportsMap.ins;
						var markers = service.searchReportsMap.markers;
						var imagePath = 'node_modules/js-marker-clusterer/images/m';
						service.searchReportsMap.markerCluster = new MarkerClusterer(map, markers, { imagePath: imagePath });

					}, 1000);
				}
			},
			addSingleMarker: function(collection, i) {

				var infowindow = new google.maps.InfoWindow();
				var iconName = collection[i].group == 'lost' ? 'red-dot.png' : 'blue-dot.png';

				var newMarker = new google.maps.Marker({
					map: service.searchReportsMap.ins,
					position: new google.maps.LatLng(collection[i].geolocation.lat, collection[i].geolocation.lng),
					icon: 'http://maps.google.com/mapfiles/ms/icons/' + iconName
				});

				newMarker.addListener('mouseover', function() {
					infowindow.setContent(collection[i].title);
					infowindow.open(service.searchReportsMap.ins, newMarker);
				});

				newMarker.addListener('mouseout', function() {
					infowindow.close();
				});

				newMarker.addListener('click', function() {
					$state.go('app.report', { id: collection[i]._id });
				});

				service.searchReportsMap.markers.push(newMarker);
			}
		};

		return service;
	};

	googleMapService.$inject = ['$q', '$timeout', '$state', 'reportsConf'];
	angular.module('appModule').service('googleMapService', googleMapService);

})();