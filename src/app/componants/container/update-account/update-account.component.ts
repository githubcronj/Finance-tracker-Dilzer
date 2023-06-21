import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { updateAccountTranslations } from './update-account.translations';
import { HttpService } from '../../../services/http.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { UserType } from '../../../model/enum/user-type.enum';
import { CountryCodeService } from '../../../services/countryCode.service';
import { RequestMethod } from '@angular/http';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { User } from '../../../model/user';
import { NavbarComponent } from '../navbar/navbar.component';
import { MessageService } from '../../../services/message.service';



@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css']
})
export class UpdateAccountComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  userData: any = {};

  updateAccountErrorStatus = false;
  updateAccountSuccessStatus = false;
  updateAccountMessage = '';
  updateAccountTranslations = updateAccountTranslations;
  loadingOnSubmit = false;
  countriesCode = CountryCodeService.codes();
  userType = UserType;

  updateAccountForm = new FormGroup({

    firstNameControl: new FormControl(null, Validators.required),
    lastNameControl: new FormControl(null),
    isdControl: new FormControl(null),
    emailControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.emailPattern)]),
    mobilePhoneNumberControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.mobilePattern)]),
    qualificationControl: new FormControl(null),
    certificationControl: new FormControl(null)
  });

  constructor(private usermanagement: HttpService,
    private validationService: ValidationService,
    private userRepositoryService: KeychainService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
    this.navbar.routeBackTitle = 'Home';
    this.navbar.title = "Update Account"        
    this.navbar.isBorderEnabled = true;
    this.navbar.routeBackPath = "/auth/home"
    
    this.userData = this.userRepositoryService.loggedInUser.duplicate()
  }

  async updateAccount() {
    
    let validationSucceded = true;

    if (this.userData && !this.userData.name.firstName) {
      this.updateAccountForm.controls['firstNameControl'].setErrors({ 'required': true });
      this.updateAccountForm.controls['firstNameControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userData && !this.userData.email) {
      this.updateAccountForm.controls['emailControl'].setErrors({ 'required': true });
      this.updateAccountForm.controls['emailControl'].markAsTouched();
      validationSucceded = false;
    }
    const emailPattern = this.validationService.emailPattern;
    if (this.userData && !emailPattern.test(this.userData.email)) {
      this.updateAccountForm.controls['emailControl'].setErrors({ 'pattern': true });
      this.updateAccountForm.controls['emailControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userData && !this.userData.ph.ph) {
      this.updateAccountForm.controls['mobilePhoneNumberControl'].setErrors({ 'required': true });
      this.updateAccountForm.controls['mobilePhoneNumberControl'].markAsTouched();
      validationSucceded = false;
    }
    const phonePattern = this.validationService.mobilePattern;
    if (this.userData && !phonePattern.test(this.userData.ph.ph)) {
      this.updateAccountForm.controls['mobilePhoneNumberControl'].setErrors({ 'pattern': true });
      this.updateAccountForm.controls['mobilePhoneNumberControl'].markAsTouched();
      validationSucceded = false;
    }
    if (validationSucceded) {
      this.loadingOnSubmit = true;

      try {

        const response = await this.usermanagement.request(RequestMethod.Post, "update-account", this.userData);
       
        let parser = new JsonConvert()
        let updatedUser = parser.deserialize(response.user, User)
        this.userRepositoryService.loggedInUser = updatedUser

        const message = response.message
        this.loadingOnSubmit = false;
        this.updateAccountErrorStatus = false;
        this.updateAccountSuccessStatus = true;
        this.updateAccountMessage = message;

      } catch (error) {

        this.loadingOnSubmit = false;
        this.updateAccountErrorStatus = true;
        this.updateAccountSuccessStatus = false;
        this.updateAccountMessage = error.message;
      }

    }
  }


}
