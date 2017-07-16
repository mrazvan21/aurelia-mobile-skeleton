import {PLATFORM} from 'aurelia-pal';

export class Auth {

  configureRouter(config, router) {
    config.map([
      { route: ['', 'login'], name: 'login', moduleId: PLATFORM.moduleName('auth/login/login'), nav: true, title: 'login title' }
    ]);

    this.router = router;
  }
}
