describe('MyFormModel should', () => {

  let MyFormModel;

  beforeEach(() => {
    window.setupAngularModule();
    window.inject((_MyFormModel_) => { MyFormModel = _MyFormModel_; });
  });

  it('be defined', () => { expect(MyFormModel).toBeDefined(); });

});