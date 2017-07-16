import {AureliaUX} from 'aurelia-ux';
import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';

@inject(AureliaUX)
export class App {

  constructor(ux) {
    ux.design.primary = '#eef4f9';
    ux.design.accent = '#0083ff';
  }

  configureRouter(config, router) {
    config.title = 'Aurelia';

    config.map([
      { route: ['', 'auth'], name: 'auth', moduleId: PLATFORM.moduleName('auth/auth'), title: 'auth title' }
    ]);

    this.router = router;
  }
}
