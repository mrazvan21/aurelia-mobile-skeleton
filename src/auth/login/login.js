import {UXFormRenderer} from './../../services/ux-forms-form-renderer';
import {ValidationControllerFactory, ValidationRules} from 'aurelia-validation';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(ValidationControllerFactory, Router)
export class Login {

  constructor(/*authService,*/ controllerFactory, router) {
    this.email = '';
    this.password = '';

    /*this.authService = authService;*/
    this.router = router;
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.addRenderer(new UXFormRenderer());
  }

  submit() {

    this.controller.validate().then((value) => {
      if(! value.valid) {
        return;
      }

     alert('ok');
    });
  }

}

ValidationRules
  .ensure('email').required().email()
  .ensure('password').required()
  .on(Login);
