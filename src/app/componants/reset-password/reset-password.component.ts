import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourcesService } from '../../services/resources.service';
import { HttpService } from '../../services/http.service';
import { ValidationService } from '../../services/validation.service';
import { resetPasswordTranslations } from './reset-password.translations';
import { RequestMethod } from '@angular/http';
import { MessageService } from '../../services/message.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetpasswordComponent implements OnInit {

  userData: any = { password: undefined, confirmPassword: undefined };
  resetPasswordTranslations = resetPasswordTranslations

  tempToken = '';

  resetPasswordErrorStatus = false;
  resetPasswordSuccessStatus = false;
  resetPasswordMessage = '';
  loadingOnSubmit = false;


  resetPasswordForm = new FormGroup({
    passwordControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.passwordPattern)]),
    confirmPasswordControl: new FormControl(null, Validators.required)
  }, this.passwordMatchValidator);

  constructor(private route: ActivatedRoute, private usermanagement: HttpService,
    private router: Router, public resources: ResourcesService,
    private validationService: ValidationService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
    this.tempToken = this.route.snapshot.params['token'];

  }


  passwordMatchValidator(passwordMatch: FormGroup) {
    if (passwordMatch.get('passwordControl').value === passwordMatch.get('confirmPasswordControl').value) {
      return null;
    } else {
      passwordMatch.get('confirmPasswordControl').setErrors({ 'required': true });
    }
  }

  async resetPassword() {
    let validationSucceded = true;

    if (this.userData && !this.userData.password) {
      this.resetPasswordForm.controls['passwordControl'].setErrors({ 'required': true });
      this.resetPasswordForm.controls['passwordControl'].markAsTouched();
      validationSucceded = false;
    }
    const passwordPattern = this.validationService.passwordPattern;
    if (this.userData && !passwordPattern.test(this.userData.password)) {
      this.resetPasswordForm.controls['passwordControl'].setErrors({ 'pattern': true });
      this.resetPasswordForm.controls['passwordControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userData && !this.userData.confirmPassword) {
      this.resetPasswordForm.controls['confirmPasswordControl'].setErrors({ 'required': true });
      this.resetPasswordForm.controls['confirmPasswordControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userData.password !== this.userData.confirmPassword) {
      this.resetPasswordForm.controls['confirmPasswordControl'].setErrors({ 'required': true });
      this.resetPasswordForm.controls['confirmPasswordControl'].markAsTouched();
      validationSucceded = false;
    }
    if (validationSucceded) {
      this.loadingOnSubmit = true;

      try {

        await this.usermanagement.request(RequestMethod.Put, "reset-password", { "password": this.userData.password, "token": this.tempToken });
        this.loadingOnSubmit = false;
        this.router.navigate(['/login']);

      } catch (error) {

        this.loadingOnSubmit = false;
        this.resetPasswordErrorStatus = true;
        this.resetPasswordSuccessStatus = false;

        if (error.status == 401) {

          this.resetPasswordMessage = "Reset Password link has expired."

        } else {

          this.resetPasswordMessage = error.message;

        }
      }
    }

  }

}
