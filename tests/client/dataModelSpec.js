describe('dataModel', function() {

	var formModelService;
	var personalDetailsModel, userModel;
	var values1, values2, error;

	beforeEach(function() {

		initApp();

		inject(function($injector) {
			formModelService = $injector.get('formModelService');
			personalDetailsModel = formModelService.personalDetailsModel;
			userModel = formModelService.userModel;
		});

		values1 = { username: 'Karmello' };
		values2 = { email: 'nogakamil@vp.pl' };
		error = 'Validation Error';
	});



	describe('keys', function() {

		describe('personalDetailsModel', function() {

			it('length should equal 8', function() {
				expect(personalDetailsModel.keys.length).toEqual(8);
			});
		});
	});

	describe('values', function() {

		describe('personalDetailsModel', function() {

			it('length should equal 8', function() {
				expect(Object.keys(personalDetailsModel.values).length).toEqual(8);
			});

			it('username should be undefined', function() {
				expect(personalDetailsModel.values.username.value).toBeUndefined();
			});

			it('username should be Karmello', function() {
				personalDetailsModel.set(values1);
				expect(personalDetailsModel.values.username.value).toEqual(values1.username);
			});

			it('username should be undefined', function() {
				personalDetailsModel.set(values1);
				personalDetailsModel.clear();
				expect(personalDetailsModel.values.username.value).toBeUndefined();
			});

			it('username should be Karmello', function() {
				personalDetailsModel.set(values1);
				personalDetailsModel.clear();
				personalDetailsModel.set();
				expect(personalDetailsModel.values.username.value).toEqual(values1.username);
			});

			it('username should be undefined', function() {
				personalDetailsModel.set(values1);
				personalDetailsModel.set({});
				expect(personalDetailsModel.values.username.value).toBeUndefined();
			});

			it('username should be Karmello', function() {
				personalDetailsModel.set(values1);
				personalDetailsModel.clearErrors();
				expect(personalDetailsModel.values.username.value).toEqual(values1.username);
			});

			it('username should be Karmello', function() {
				personalDetailsModel.setValue('username', values1.username);
				expect(personalDetailsModel.getValue('username')).toEqual(values1.username);
			});
		});
	});

	describe('defaults', function() {

		describe('personalDetailsModel', function() {

			it('should be undefined', function() {
				expect(personalDetailsModel.defaults).toBeUndefined();
			});

			it('default username should be Karmello', function() {
				personalDetailsModel.set(values1);
				expect(personalDetailsModel.defaults.username).toEqual(values1.username);
			});
		});

		describe('userModel', function() {

			it('defaults should be undefined', function() {
				userModel.set(values2);
				expect(userModel.defaults).toBeUndefined();
			});
		});
	});

	describe('errors', function() {

		describe('personalDetailsModel', function() {

			it('username error should be ' + error, function() {
				personalDetailsModel.values.username.error = error;
				expect(personalDetailsModel.values.username.error).toEqual(error);
			});

			it('username error should be undefined', function() {
				personalDetailsModel.values.username.error = error;
				personalDetailsModel.clear();
				expect(personalDetailsModel.values.username.error).toBeUndefined();
			});

			it('username error should be undefined', function() {
				personalDetailsModel.values.username.error = error;
				personalDetailsModel.clearErrors();
				expect(personalDetailsModel.values.username.error).toBeUndefined();
			});
		});
	});
});