import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { changePasswordTranslations } from './change-password.translations';
import { HttpService } from '../../../services/http.service';
import { ValidationService } from '../../../services/validation.service';
import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { MessageService } from '../../../services/message.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  userData: any = {};

  changePasswordErrorStatus = false;
  changePasswordSuccessStatus = false;
  changePasswordMessage = '';
  changePasswordTranslations = changePasswordTranslations;
  loadingOnSubmit = false;


  changePasswordForm = new FormGroup({
    oldPasswordControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.passwordPattern)]),
    passwordControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.passwordPattern)]),
    confirmPasswordControl: new FormControl(null, Validators.required)
  }, this.passwordMatchValidator);


  constructor(private usermanagement: HttpService,
    private validationService: ValidationService,
    private messageService: MessageService
  ) { }



  ngOnInit() {
    this.navbar.routeBackTitle = 'Home';
    this.navbar.title = "Change Password"
    this.navbar.isBorderEnabled = true;
    this.navbar.routeBackPath = '/auth/home'
  }

  passwordMatchValidator(passwordMatch: FormGroup) {
    if (passwordMatch.get('passwordControl').value === passwordMatch.get('confirmPasswordControl').value) {
      return null;
    } else {
      passwordMatch.get('confirmPasswordControl').setErrors({ 'required': true });
    }
  }


  async changePassword() {
    let validationSucceded = true;

    if (this.userData && !this.userData.oldPassword) {
      this.changePasswordForm.controls['oldPasswordControl'].setErrors({ 'required': true });
      this.changePasswordForm.controls['oldPasswordControl'].markAsTouched();
      validationSucceded = false;
    }
    const passwordCheck = this.validationService.passwordPattern;
    if (this.userData && !passwordCheck.test(this.userData.oldPassword)) {
      this.changePasswordForm.controls['oldPasswordControl'].setErrors({ 'pattern': true });
      this.changePasswordForm.controls['oldPasswordControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userData && !this.userData.newPassword) {
      this.changePasswordForm.controls['passwordControl'].setErrors({ 'required': true });
      this.changePasswordForm.controls['passwordControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.userData && !passwordCheck.test(this.userData.newPassword)) {
      this.changePasswordForm.controls['passwordControl'].setErrors({ 'pattern': true });
      this.changePasswordForm.controls['passwordControl'].markAsTouched();
      validationSucceded = false;
    }

    if (this.userData && !this.userData.confirmPassword) {
      this.changePasswordForm.controls['confirmPasswordControl'].setErrors({ 'required': true });
      this.changePasswordForm.controls['confirmPasswordControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userData.newPassword !== this.userData.confirmPassword) {
      this.changePasswordForm.controls['confirmPasswordControl'].setErrors({ 'required': true });
      this.changePasswordForm.controls['confirmPasswordControl'].markAsTouched();
      validationSucceded = false;
    }
    if (validationSucceded) {
      this.loadingOnSubmit = true;

      try {
        const response = await this.usermanagement.request(RequestMethod.Put, "change-password", { "oldPassword": this.userData.oldPassword, "newPassword": this.userData.newPassword });
        const message = response.message
        this.loadingOnSubmit = false;
        this.changePasswordErrorStatus = false;
        this.changePasswordSuccessStatus = true;
        this.changePasswordForm.reset();
        this.changePasswordMessage = message;

      } catch (error) {

        this.loadingOnSubmit = false;
        this.changePasswordErrorStatus = true;
        this.changePasswordSuccessStatus = false;
        this.changePasswordMessage = error.message;
      }

    }
  }

}
