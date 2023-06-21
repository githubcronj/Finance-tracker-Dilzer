import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { registrationTranslations } from './registration.translations';
import { ResourcesService } from '../../services/resources.service';
import { HttpService } from '../../services/http.service';
import { ValidationService } from '../../services/validation.service';
import { CountryCodeService } from '../../services/countryCode.service';
import { RequestMethod } from '@angular/http';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

    registrationTranslations = registrationTranslations;
    userData = {
        name: {
            firstName: undefined,
            lastName: undefined
        },
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
        ph: {
            isd: undefined,
            std: undefined,
            ph: undefined
        }
    };
    countriesCode = CountryCodeService.codes();


    registerErrorStatus = false;
    registerSuccessStatus = false;
    registrationMessage = '';
    loadingOnSubmit = false;
    registrationFormShowHide = true;

    registrationForm = new FormGroup({
        dilzerFirstNameControl: new FormControl(null, Validators.required),
        dilzerLastNameControl: new FormControl(null),
        dilzerIsdControl: new FormControl(null),
        dilzerEmailControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.emailPattern)]),
        dilzerPasswordControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.passwordPattern)]),
        dilzerConfirmPasswordControl: new FormControl(null, Validators.required),
        dilzerMobilePhoneNumberControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.mobilePattern)])
    }, this.passwordMatchValidator);

    constructor(private usermanagement: HttpService, public resources: ResourcesService,
        private validationService: ValidationService,
        private messageService: MessageService
    ) { }


    ngOnInit() {
        if (!this.userData.ph.isd) {
            this.userData.ph.isd = "91";
        }
    }

    // Password and reset password match validation
    passwordMatchValidator(passwordMatch: FormGroup) {
        if (passwordMatch.get('dilzerPasswordControl').value === passwordMatch.get('dilzerConfirmPasswordControl').value) {
            return null;
        } else {
            passwordMatch.get('dilzerConfirmPasswordControl').setErrors({ 'required': true });
        }
    }

    // Validate and register new user
    async registerUsers() {
        let validationSucceded = true;

        if (this.userData && !this.userData.name.firstName) {
            this.registrationForm.controls['dilzerFirstNameControl'].setErrors({ 'required': true });
            this.registrationForm.controls['dilzerFirstNameControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.userData && !this.userData.email) {
            this.registrationForm.controls['dilzerEmailControl'].setErrors({ 'required': true });
            this.registrationForm.controls['dilzerEmailControl'].markAsTouched();
            validationSucceded = false;
        }
        const emailPattern = this.validationService.emailPattern;
        if (this.userData && !emailPattern.test(this.userData.email)) {
            this.registrationForm.controls['dilzerEmailControl'].setErrors({ 'pattern': true });
            this.registrationForm.controls['dilzerEmailControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.userData && !this.userData.password) {
            this.registrationForm.controls['dilzerPasswordControl'].setErrors({ 'required': true });
            this.registrationForm.controls['dilzerPasswordControl'].markAsTouched();
            validationSucceded = false;
        }
        const passwordPattern = this.validationService.passwordPattern;
        if (this.userData && !passwordPattern.test(this.userData.password)) {
            this.registrationForm.controls['dilzerPasswordControl'].setErrors({ 'required': true });
            this.registrationForm.controls['dilzerPasswordControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.userData && !this.userData.confirmPassword) {
            this.registrationForm.controls['dilzerConfirmPasswordControl'].setErrors({ 'required': true });
            this.registrationForm.controls['dilzerConfirmPasswordControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.userData.password !== this.userData.confirmPassword) {
            this.registrationForm.controls['dilzerConfirmPasswordControl'].setErrors({ 'required': true });
            this.registrationForm.controls['dilzerConfirmPasswordControl'].markAsTouched();
            validationSucceded = false;
        }
        if (this.userData && !this.userData.ph) {
            this.registrationForm.controls['dilzerMobilePhoneNumberControl'].setErrors({ 'required': true });
            this.registrationForm.controls['dilzerMobilePhoneNumberControl'].markAsTouched();
            validationSucceded = false;
        }
        const phonePattern = this.validationService.mobilePattern;
        if (this.userData && !phonePattern.test(this.userData.ph.ph)) {
            this.registrationForm.controls['dilzerMobilePhoneNumberControl'].setErrors({ 'pattern': true });
            this.registrationForm.controls['dilzerMobilePhoneNumberControl'].markAsTouched();
            validationSucceded = false;
        }
        if (validationSucceded) {
            this.loadingOnSubmit = true;

            try {

                const response = await this.usermanagement.request(RequestMethod.Post, "register", this.userData);
                this.loadingOnSubmit = false;
                this.registerErrorStatus = false;
                this.registerSuccessStatus = true;
                this.registrationMessage = response.message;
                this.registrationForm.reset();
                if (this.registrationMessage) {
                    this.registrationFormShowHide = false;
                }

            } catch (error) {

                this.loadingOnSubmit = false;
                this.registerErrorStatus = true;
                this.registerSuccessStatus = false;
                this.registrationMessage = error.message;
            }
        }
    }

}
