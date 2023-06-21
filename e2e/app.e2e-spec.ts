import { DilzerPage } from './app.po';

describe('dilzer App', () => {
  let page: DilzerPage;

  beforeEach(() => {
    page = new DilzerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
