import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { loginTranslations } from './login.translations';
import { ResourcesService } from '../../services/resources.service';
import { HttpService } from '../../services/http.service';
import { ValidationService } from '../../services/validation.service';
import { RequestMethod } from '@angular/http';
import { KeychainService } from '../../services/keychain.service';
import { Router } from '@angular/router';
import { JsonConvert } from '../../model/parsers/json-convert';
import { User } from '../../model/user';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginTranslations = loginTranslations;
  loginUserData = { email: undefined, password: undefined }


  loginErrorStatus = false;
  loginSuccessStatus = false;
  loginMessage = '';
  loadingOnSubmit = false;


  loginForm = new FormGroup({
    dilzerEmailControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.emailPattern)]),
    dilzerPasswordControl: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });


  constructor(private usermanagement: HttpService, public resources: ResourcesService,
    private messageService: MessageService,
    private validationService: ValidationService, private keychain: KeychainService, private router: Router
  ) { }

  ngOnInit() {
  }

  async loginUser() {
    let validationSucceded = true;
    if (this.loginUserData && !this.loginUserData.email) {
      this.loginForm.controls['dilzerEmailControl'].setErrors({ 'required': true });
      this.loginForm.controls['dilzerEmailControl'].markAsTouched();
      validationSucceded = false;
    }
    const emailPattern = this.validationService.emailPattern;
    if (this.loginUserData.email && !emailPattern.test(this.loginUserData.email)) {
      this.loginForm.controls['dilzerEmailControl'].setErrors({ 'pattern': true });
      this.loginForm.controls['dilzerEmailControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.loginUserData && !this.loginUserData.password) {
      this.loginForm.controls['dilzerPasswordControl'].setErrors({ 'required': true });
      this.loginForm.controls['dilzerPasswordControl'].markAsTouched();
      validationSucceded = false;
    }
    if (validationSucceded) {
      try {
        this.loadingOnSubmit = true;
        this.keychain.clear()
        const response = await this.usermanagement.request(RequestMethod.Post, "authenticate", this.loginUserData);
        let parser = new JsonConvert()
        let user = parser.deserialize(response.user, User)
        this.keychain.save(response.token)
        this.keychain.loggedInUser = user

        this.router.navigate(["auth/home"]);

      } catch (error) {

        this.loadingOnSubmit = false;
        this.loginErrorStatus = true;
        this.loginMessage = error.message;
      }
    }
  }
}
