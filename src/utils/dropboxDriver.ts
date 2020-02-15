import { Dropbox } from 'dropbox';

export class DropboxDriver {
  accessToken: string;
  fetchTool: Function;

  constructor(accessToken: string, fetchTool: Function) {
    this.accessToken = accessToken;
    this.fetchTool = fetchTool;
  }

  getInstance() {
    return new Dropbox({
      accessToken: this.accessToken,
      fetch: this.fetchTool,
    });
  }
}
