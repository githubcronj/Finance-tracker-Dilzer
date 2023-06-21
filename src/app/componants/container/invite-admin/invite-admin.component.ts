import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { inviteAdminTranslations } from './invite-admin.translations';
import { HttpService } from '../../../services/http.service';
import { ValidationService } from '../../../services/validation.service';
import { KeychainService } from '../../../services/keychain.service';
import { Admin } from '../../../model/admin'
import { TeamMemberRole, TeamMemberRoleUtils } from '../../../model/enum/team-member-role.enum'
import { RequestMethod } from '@angular/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonConvert } from '../../../model/parsers/json-convert';
import * as cleanDeep from 'clean-deep';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-invite-admin',
  templateUrl: './invite-admin.component.html',
  styleUrls: ['./invite-admin.component.css']
})
export class InviteAdminComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;
  userData = {
    name: {
      firstName: undefined,
      lastName: undefined
    },
    email: undefined,
    role: undefined
  };
  loggedInAdmin: Admin = this.userRepositoryService.loggedInUser
  adminId: any
  buttonText: any

  inviteAdminErrorStatus = false;
  inviteAdminSuccessStatus = false;
  inviteAdminMessage = '';
  inviteAdminTranslations = inviteAdminTranslations;
  loadingOnSubmit = false;
  accessLevelDropDown = TeamMemberRoleUtils.getTeamMemberRoleArray();
  teamRole = TeamMemberRole;


  inviteAdminForm = new FormGroup({
    firstNameControl: new FormControl(null, Validators.required),
    lastNameControl: new FormControl(null),
    emailControl: new FormControl(null, [Validators.required, Validators.pattern(this.validationService.emailPattern)]),
    accessLevelControl: new FormControl(1, Validators.required)
  }, );


  constructor(private usermanagement: HttpService,
    private validationService: ValidationService,
    private userRepositoryService: KeychainService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }



  async ngOnInit() {
    this.adminId = this.route.snapshot.params['adminId'];
    this.navbar.routeBackTitle = 'Home';
    if (this.adminId) {
      this.navbar.title = "Update Admin Details"
      this.buttonText = "Update"
    } else {
      this.navbar.title = "Invite Team Member"
      this.buttonText = "Invite"
    }

    this.navbar.isBorderEnabled = true;
    this.navbar.routeBackPath = "/auth/home";
    this.navbar.routeBackQueryParams = { selected: 1 };

    if (this.adminId) {
      try {
        this.messageService.sendMessage('show-loading');
        const response = await this.usermanagement.request(RequestMethod.Get, "admin/" + this.adminId, null);
        const parser = new JsonConvert()
        this.userData = parser.deserialize(response.admin, Admin);
        this.messageService.sendMessage('hide-loading');
      } catch (error) {

      }
    }
    if (!this.userData.role) {
      this.userData.role = TeamMemberRole.ParaPlanner;
    }


  }

  async inviteAdmin() {

    let validationSucceded = true;

    if (this.userData && !this.userData.name.firstName) {
      this.inviteAdminForm.controls['firstNameControl'].setErrors({ 'required': true });
      this.inviteAdminForm.controls['firstNameControl'].markAsTouched();
      validationSucceded = false;
    }
    if (this.userData && !this.userData.email) {
      this.inviteAdminForm.controls['emailControl'].setErrors({ 'required': true });
      this.inviteAdminForm.controls['emailControl'].markAsTouched();
      validationSucceded = false;
    }
    const emailPattern = this.validationService.emailPattern;
    if (this.userData.email && !emailPattern.test(this.userData.email)) {
      this.inviteAdminForm.controls['emailControl'].setErrors({ 'pattern': true });
      this.inviteAdminForm.controls['emailControl'].markAsTouched();
      validationSucceded = false;
    }

    if (validationSucceded) {
      let method;
      let url;
      this.loadingOnSubmit = true;
      if (this.adminId) {
        method = RequestMethod.Put
        url = "admin/update-admin-details"
      } else {
        method = RequestMethod.Post
        url = "admin/invite"
      }

      try {

        let userJsonObj = JSON.parse(JSON.stringify(this.userData))
        userJsonObj = cleanDeep(userJsonObj);

        const response = await this.usermanagement.request(method, url, userJsonObj);
        const message = response.message
        this.loadingOnSubmit = false;
        this.inviteAdminErrorStatus = false;
        this.inviteAdminSuccessStatus = true;
        this.inviteAdminMessage = message;
        this.inviteAdminForm.controls['firstNameControl'].reset();
        this.inviteAdminForm.controls['lastNameControl'].reset();
        this.inviteAdminForm.controls['emailControl'].reset();


      } catch (error) {

        this.loadingOnSubmit = false;
        this.inviteAdminErrorStatus = true;
        this.inviteAdminSuccessStatus = false;
        this.inviteAdminMessage = error.message;
      }
    }
  }

  async updateAdmin() {

  }

  routeBack() {
    this.navbar.routeBack()
  }
}
