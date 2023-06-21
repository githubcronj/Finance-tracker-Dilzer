import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { acceptInvitationTranslations } from './accept-invitation.translations';
import { ResourcesService } from '../../services/resources.service';
import { HttpService } from '../../services/http.service';
import { ValidationService } from '../../services/validation.service';
import { RequestMethod } from '@angular/http';
import { KeychainService } from '../../services/keychain.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonConvert } from '../../model/parsers/json-convert';
import { CountryCodeService } from '../../services/countryCode.service';
import { User } from '../../model/user';
import { MessageService } from '../../services/message.service';



@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html',
  styleUrls: ['./accept-invitation.component.css']
})
export class AcceptInvitationComponent implements OnInit {

  acceptInvitationTranslations = acceptInvitationTranslations;
  userData = {
    ph: {
      ph: undefined,
      isd: undefined
    },
    dob: undefined,
    doj: undefined,
    password: undefined,
    confirmPassword: undefined,
    email: undefined,
    qualification: undefined,
    certification: undefined
  }


  acceptInvitationErrorStatus = false;
  acceptInvitationSuccessStatus = false;
  acceptInvitationMessage = '';
  loadingOnSubmit = false;
  token = '';
  maxDate: Date;
  minDate: Date;
  countriesCode = CountryCodeService.codes();


  acceptInvitationForm = new FormGroup({
    mobileControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.mobilePattern)]),
    dobControl: new FormControl(null, [Validators.required]),
    dilzerIsdControl: new FormControl(null),
    dilzerEmailControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.emailPattern)]),
    dojControl: new FormControl(null, [Validators.required]),
    qualificationControl: new FormControl(null, [Validators.required]),
    certificationControl: new FormControl(null, [Validators.required]),
    passwordControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.passwordPattern)]),
    confirmPasswordControl: new FormControl(null, Validators.required)
  }, this.passwordMatchValidator);


  constructor(private usermanagement: HttpService, public resources: ResourcesService,
    private messageService: MessageService,
    private validationService: ValidationService, private keychain: KeychainService, private router: Router, private route: ActivatedRoute
  ) { }

  passwordMatchValidator(passwordMatch: FormGroup) {
    if (passwordMatch.get('passwordControl').value === passwordMatch.get('confirmPasswordControl').value) {
      return null;
    } else {
      passwordMatch.get('confirmPasswordControl').setErrors({ 'required': true });
    }
  }

  ngOnInit() {
    if (this.route.snapshot.params['token']) {
      this.token = this.route.snapshot.params['token'];
    }
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    this.maxDate = new Date();
    this.maxDate.setMonth(month);
    this.maxDate.setFullYear((year - 18));

    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(1931);
    if (!this.userData.dob) {
      this.userData.dob = this.minDate;
    }
    if (!this.userData.ph.isd) {
      this.userData.ph.isd = "91";
    }
    this.messageService.sendMessage('hide-loading');

  }

  async acceptInvitation() {

    let validationSucceded = true;

    if (this.userData && !this.userData.password) {
      this.acceptInvitationForm.controls['passwordControl'].setErrors({ 'required': true });
      this.acceptInvitationForm.controls['passwordControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userData && !this.userData.confirmPassword) {
      this.acceptInvitationForm.controls['dilzerConfirmPasswordControl'].setErrors({ 'required': true });
      this.acceptInvitationForm.controls['dilzerConfirmPasswordControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userData.password !== this.userData.confirmPassword) {
      this.acceptInvitationForm.controls['dilzerConfirmPasswordControl'].setErrors({ 'required': true });
      this.acceptInvitationForm.controls['dilzerConfirmPasswordControl'].markAsTouched();
      validationSucceded = false;
    }
    const phonePattern = this.validationService.mobilePattern;
    if (this.userData && !phonePattern.test(this.userData.ph.ph)) {
      this.acceptInvitationForm.controls['mobileControl'].setErrors({ 'pattern': true });
      this.acceptInvitationForm.controls['mobileControl'].markAsTouched();
      validationSucceded = false;
    }
    if (validationSucceded) {

      try {

        const response = await this.usermanagement.request(RequestMethod.Post, "admin/accept-invitation/" + this.token, this.userData);
        const message = response.message
        this.loadingOnSubmit = false;
        this.acceptInvitationErrorStatus = false;
        this.acceptInvitationSuccessStatus = true;
        this.acceptInvitationForm.reset();
        this.acceptInvitationMessage = message;
        this.router.navigate(['/login']);


      } catch (error) {

        this.loadingOnSubmit = false;
        this.acceptInvitationErrorStatus = true;
        this.acceptInvitationSuccessStatus = false;
        this.acceptInvitationMessage = error.message;

      }
    }
  }
}
