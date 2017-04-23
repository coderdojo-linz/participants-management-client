import { ParticipantsManagementClientCliPage } from './app.po';

describe('participants-management-client-cli App', function() {
  let page: ParticipantsManagementClientCliPage;

  beforeEach(() => {
    page = new ParticipantsManagementClientCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
