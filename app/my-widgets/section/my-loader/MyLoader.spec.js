describe('MyLoader should', () => {

  let MyLoader, myLoader;

  beforeEach(() => {
    window.setupAngularModule();
    window.inject((_MyLoader_) => { MyLoader = _MyLoader_; });
    myLoader = new MyLoader(100, 200);
  });

  it('be defined', () => { expect(MyLoader).toBeDefined(); });

  describe('myLoader should', () => {
    it('be defined', () => { expect(myLoader).toBeDefined(); });
    it('have start method defined', () => { expect(myLoader.start).toBeDefined(); });
    it('have stop method defined', () => { expect(myLoader.stop).toBeDefined(); });
    it('have isLoading = false', () => { expect(myLoader.isLoading).toBeFalsy(); });
    it('have minLoadTime = 100', () => { expect(myLoader.minLoadTime).toEqual(100); });
    it('have stopTimeOut = 200', () => { expect(myLoader.stopTimeOut).toEqual(200); });
  });

});