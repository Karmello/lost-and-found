(function() {

	'use strict';

	var exchangeRateService = function() {

		var config = {
			api: 'http://api.fixer.io/latest?base=',
			availableRates: {
				'USD': { sign: '$' },
				'EUR': { sign: '€' },
				'GBP': { sign: '£' }
			},
			decimalPlaces: 2
		};

		var data = {};

		var methods = {
			format: function(amount, to) {

				if (angular.isDefined(amount) && angular.isDefined(to)) {
					return accounting.formatMoney(amount, config.availableRates[to].sign + ' ', config.decimalPlaces, ',', '.');

				} else { return null; }
			},
			convert: function(amount, from, to) {

				if (Object.keys(data).length > 0) {

					if (angular.isDefined(amount) && angular.isDefined(from) && angular.isDefined(to)) {

						fx.settings = { from: from };
						fx.base = data[to].base;
						fx.rates = data[to].rates;

						return methods.format(fx.convert(amount, { to: to }), to);

					} else { return null; }
				} else { return null; }
			}
		};



		return {
			config: config,
			data: data,
			methods: methods
		};
	};



	exchangeRateService.$inject = [];
	angular.module('appModule').service('exchangeRateService', exchangeRateService);

})();