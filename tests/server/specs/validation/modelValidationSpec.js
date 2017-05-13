/* jshint expr: true, loopfunc: true */

var r = require('./../../_requires');
var modelSetups = require(__dirname + '/modelSetups');

//delete modelSetups.User;
//delete modelSetups.Report;

describe('modelValidationSpec\n', function() {

	var that;

	beforeEach(function() {
		that = this;
		that.req = r.helpers.getReqObj();
	});

	for (var modelName in modelSetups) {
		describe(modelName + ' model', function() {
			for (var fieldName in modelSetups[modelName]) {
				describe('when ' + fieldName, function() {
					for (var inputCaseName in modelSetups[modelName][fieldName].inputCases) {

						// Loop body

						describe(modelSetups[modelName][fieldName].inputCases[inputCaseName].description, function(done) {

							var _modelName = modelName;
							var _fieldName = fieldName;
							var _inputCaseName = inputCaseName;

							var inputCase = modelSetups[_modelName][_fieldName].inputCases[_inputCaseName];
							var fullError = inputCase.error;

							if (!inputCase.globalError) {
								fullError = _modelName.toLowerCase() + '.' + _fieldName + '.' + fullError;
							}

							// Spec

							it('should return error of type ' + fullError, function(done) {

								var model = {};
								model[_fieldName] = inputCase.value;
								var doc = new r[_modelName](model);

								var validationMethod;
								if (doc._validate) { validationMethod = doc._validate; } else { validationMethod = doc.validate; }

								validationMethod.call(doc, { req: that.req }, function(err) {

									r.expect(err).to.be.defined;
									r.expect(err.errors).to.be.defined;
									r.expect(err.errors[_fieldName]).to.be.defined;
									r.expect(err.errors[_fieldName].properties).to.be.defined;
									err.errors[_fieldName].properties.should.have.property('type', fullError);

									done();
								});
							});
						});
					}
				});
			}
		});
	}
});