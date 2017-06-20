(function() {

	'use strict';

	var SAME_LOCATION_OFFSET = 0.000015;

	var googleMapService = function($q, $timeout, $state, reportsService) {

		var service = this;

		service.ins = {
			singleReportMap: undefined
		};

		service.geo = {
			allowed: undefined
		};

		service.singleReportMap = {
			init: function(report) {

				var map;

				if (!service.ins.singleReportMap) {

					map = service.ins.singleReportMap = new google.maps.Map(document.getElementById('reportMap'));
					google.maps.event.addListener(map, 'idle', function() { google.maps.event.trigger(map, 'resize'); });

				} else {

					map = service.ins.singleReportMap;
				}

				var geocoder = new google.maps.Geocoder();

				geocoder.geocode({ 'placeId': report.startEvent.placeId }, function(results, status) {

					$timeout(function() {

						var latLng = new google.maps.LatLng(report.startEvent.lat, report.startEvent.lng);

						map.setCenter(latLng);
						map.setZoom(13);

						var marker = new google.maps.Marker({
							map: map,
							position: latLng,
							icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
						});

						var infowindow = new google.maps.InfoWindow();

						marker.addListener('mouseover', function() {
							infowindow.setContent(results[0].formatted_address);
							infowindow.open(map, marker);
						});

						marker.addListener('mouseout', function() {
							infowindow.close();
						});

					});
				});
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
							service.searchReportsMap.addMarkers(reportsService.collectionBrowser.bySearchQuery.collection);
						}
					});

				} else {

					google.maps.event.trigger(service.searchReportsMap.ins, 'resize');
				}
			},
			addMarkers: function(collection) {

				if (collection && angular.isDefined(service.geo.allowed)) {

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
				var iconName = collection[i].startEvent.type == 'lost' ? 'red-dot.png' : 'blue-dot.png';

				var newMarker = new google.maps.Marker({
					map: service.searchReportsMap.ins,
					position: new google.maps.LatLng(collection[i].startEvent.lat, collection[i].startEvent.lng),
					icon: 'https://maps.google.com/mapfiles/ms/icons/' + iconName
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

	googleMapService.$inject = ['$q', '$timeout', '$state', 'reportsService'];
	angular.module('appModule').service('googleMapService', googleMapService);

})();