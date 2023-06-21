import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forgotPasswordTranslations } from './forgot-password.translations';
import { ResourcesService } from '../../services/resources.service';
import { HttpService } from '../../services/http.service';
import { ValidationService } from '../../services/validation.service';
import { RequestMethod } from '@angular/http';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordTranslations = forgotPasswordTranslations;
  userEmail: string;

  forgotPasswordMessage = '';
  forgotPasswordErrorStatus = false;
  forgotPasswordSuccessStatus = false;
  loadingOnSubmit = false;
  forgotPasswordFormShowHide = true;

  forgotPasswordForm = new FormGroup({
    emailControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.emailPattern)])
  });


  constructor(private usermanagement: HttpService,
    public resources: ResourcesService,
    private validationService: ValidationService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
  }

  async forgotPassword(event) {
    
    event.stopPropagation();
    let validationSucceded = true;

    if (!this.userEmail) {
      this.forgotPasswordForm.controls['emailControl'].setErrors({ 'required': true });
      this.forgotPasswordForm.controls['emailControl'].markAsTouched();
      validationSucceded = false;
    }
    const emailPattern = this.validationService.emailPattern;
    if (this.userEmail && !emailPattern.test(this.userEmail)) {
      this.forgotPasswordForm.controls['emailControl'].setErrors({ 'pattern': true });
      this.forgotPasswordForm.controls['emailControl'].markAsTouched();
      validationSucceded = false;
    }
    if (validationSucceded) {
      this.loadingOnSubmit = true;

      try {

        const response = await this.usermanagement.request(RequestMethod.Post, "forgot-password", { "email": this.userEmail });
        const message = response.message
        this.loadingOnSubmit = false;
        this.forgotPasswordSuccessStatus = true;
        this.forgotPasswordErrorStatus = false;
        this.forgotPasswordMessage = message;
        this.forgotPasswordForm.reset();
        if (this.forgotPasswordMessage) {
          this.forgotPasswordFormShowHide = false;
        }

      } catch (error) {

        this.loadingOnSubmit = false;
        this.forgotPasswordSuccessStatus = false;
        this.forgotPasswordErrorStatus = true;
        this.forgotPasswordMessage = error.message;

      }

    }
  }

}
