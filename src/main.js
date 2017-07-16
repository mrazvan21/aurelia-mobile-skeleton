import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'babel-polyfill';
import * as Bluebird from 'bluebird';

Bluebird.config({ warnings: { wForgottenReturn: false } });

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin(PLATFORM.moduleName('aurelia-ux'))
    .plugin(PLATFORM.moduleName('aurelia-validation'));

  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('layout/app/app'));
}
