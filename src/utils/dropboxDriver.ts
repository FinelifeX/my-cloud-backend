import * as DropboxNamespace from 'dropbox';
import { fetch } from './fetch';

const { Dropbox } = DropboxNamespace;

export class DropboxDriver {
  accessToken: string;
  fetchTool: Function;

  constructor(accessToken: string, fetchTool: Function) {
    this.accessToken = accessToken;
    this.fetchTool = fetchTool;
  }

  getInstance() {
    return new DropboxNamespace.Dropbox({
      accessToken: this.accessToken,
      fetch: this.fetchTool,
    });
  };
}