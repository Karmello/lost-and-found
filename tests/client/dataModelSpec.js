describe('dataModel', function() {

	var MyDataModel, myDataModel;

	var exampleData = {
		prop: 'xxx',
		obj: {
			prop: 'yyy'
		}
	};

	var exampleDataForTrim = {
		prop: '   xxx   ',
		obj: {
			prop: '   yyy   '
		}
	};

	var exampleErrors = {
		prop: {
			kind: 'required',
			message: 'is required'
		},
		obj: {
			prop: {
				kind: 'incorrect',
				message: 'is incorrect'
			}
		}
	};

	beforeEach(function() {

		initApp();

		inject(function($injector) {

			MyDataModel = $injector.get('MyDataModel');

			myDataModel = {
				prop: {},
				obj: {
					prop: {}
				}
			};

			myDataModel = new MyDataModel(myDataModel);
		});
	});

	it('new myDataModel instance', function() {

		expect(myDataModel.prop.value.active).toBe(undefined);
		expect(myDataModel.prop.value.default).toBe(undefined);
		expect(myDataModel.obj.prop.value.active).toBe(undefined);
		expect(myDataModel.obj.prop.value.default).toBe(undefined);
	});

	it('set method', function() {

		myDataModel.set(exampleData);

		expect(myDataModel.prop.value.active).toEqual(exampleData.prop);
		expect(myDataModel.prop.value.default).toBe(undefined);
		expect(myDataModel.obj.prop.value.active).toEqual(exampleData.obj.prop);
		expect(myDataModel.obj.prop.value.default).toBe(undefined);
	});

	it('set method with defaults', function() {

		myDataModel.set(exampleData, true);

		expect(myDataModel.prop.value.active).toEqual(exampleData.prop);
		expect(myDataModel.prop.value.default).toEqual(exampleData.prop);
		expect(myDataModel.obj.prop.value.active).toEqual(exampleData.obj.prop);
		expect(myDataModel.obj.prop.value.default).toEqual(exampleData.obj.prop);
	});

	it('getValues method', function() {

		myDataModel.set(exampleData);
		var values = myDataModel.getValues();

		expect(values.prop).toEqual(exampleData.prop);
		expect(values.obj.prop).toEqual(exampleData.obj.prop);
	});

	it('clear method', function() {

		myDataModel.set(exampleData);
		myDataModel.clear();

		expect(myDataModel.prop.value.active).toBe(undefined);
		expect(myDataModel.prop.value.default).toBe(undefined);
		expect(myDataModel.obj.prop.value.active).toBe(undefined);
		expect(myDataModel.obj.prop.value.default).toBe(undefined);
	});

	it('clear method after defaults set', function() {

		myDataModel.set(exampleData, true);
		myDataModel.clear();

		expect(myDataModel.prop.value.active).toBe(undefined);
		expect(myDataModel.prop.value.default).toBe(undefined);
		expect(myDataModel.obj.prop.value.active).toBe(undefined);
		expect(myDataModel.obj.prop.value.default).toBe(undefined);
	});

	it('setErrors method', function() {

		myDataModel.set(exampleData);
		myDataModel.setErrors(exampleErrors);

		expect(myDataModel.prop.error.kind).toEqual(exampleErrors.prop.kind);
		expect(myDataModel.prop.error.message).toEqual(exampleErrors.prop.message);
		expect(myDataModel.obj.prop.error.kind).toEqual(exampleErrors.obj.prop.kind);
		expect(myDataModel.obj.prop.error.message).toEqual(exampleErrors.obj.prop.message);
	});

	it('clearErrors method', function() {

		myDataModel.set(exampleData);
		myDataModel.setErrors(exampleErrors);
		myDataModel.clearErrors();

		expect(myDataModel.prop.value.active).toEqual(exampleData.prop);
		expect(myDataModel.obj.prop.value.active).toEqual(exampleData.obj.prop);

		expect(myDataModel.prop.error.kind).toBe(undefined);
		expect(myDataModel.prop.error.message).toBe(undefined);
		expect(myDataModel.obj.prop.error.kind).toBe(undefined);
		expect(myDataModel.obj.prop.error.message).toBe(undefined);
	});

	it('getValue method', function() {

		myDataModel.set(exampleData);

		var value1 = myDataModel.getValue('prop');
		var value2 = myDataModel.getValue('obj.prop');

		expect(value1).toEqual(exampleData.prop);
		expect(value2).toEqual(exampleData.obj.prop);
	});

	it('trimValues method', function() {

		myDataModel.set(exampleDataForTrim);

		expect(myDataModel.prop.value.active).toEqual(exampleDataForTrim.prop);
		expect(myDataModel.obj.prop.value.active).toEqual(exampleDataForTrim.obj.prop);

		var form = $('<div>').attr('id', 'myForm');
		$(form).append($('<input>').attr({ id: 'prop' }).val(exampleDataForTrim.prop));
		$(form).append($('<input>').attr({ id: 'obj_prop' }).val(exampleDataForTrim.obj.prop));
		$('body').append(form);

		myDataModel.trimValues('myForm');

		expect(myDataModel.prop.value.active).toEqual(exampleData.prop);
		expect(myDataModel.obj.prop.value.active).toEqual(exampleData.obj.prop);

		expect($('#myForm #prop').val()).toEqual(exampleData.prop);
		expect($('#myForm #obj_prop').val()).toEqual(exampleData.obj.prop);
	});
});