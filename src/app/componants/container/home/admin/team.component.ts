import { Component, OnInit, DoCheck, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { TeamMemberRole, TeamMemberRoleUtils } from '../../../../model/enum/team-member-role.enum';
import { RequestMethod } from '@angular/http';
import { Message } from 'primeng/primeng';
import { Admin } from '../../../../model/admin';
import { ResourcesService } from '../../../../services/resources.service';
import { KeychainService } from '../../../../services/keychain.service';
import { Router } from '@angular/router';
import { MessageService } from '../../../../services/message.service';
import { ErrorHandlingComponent } from '../../../error-handling/error-handling.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, DoCheck {

  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  isChief = false;
  token = '';
  plannerDetail;
  teamList: Array<Admin>;
  teamListErrorStatus = false;
  teamListSuccessStatus = false;
  teamListMessage = '';
  teamRole = TeamMemberRole;
  msgs: Message[] = [];
  loadingOnSubmit = false;
  editEnable = false;
  editButtonText = 'Edit';

  selectedClientCount = 0;
  sortTeamMemberArray = TeamMemberRoleUtils.getTeamMemberRoleArray();
  searchTerm = '';
  tempTeamList: any;
  sortByTeamType = '';
  cols: any[];
  isErrorOccured = false;


  constructor(
    private router: Router,
    private plannermanagement: HttpService,
    public resources: ResourcesService,
    private keychain: KeychainService,
    private elementRef: ElementRef,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef
  ) { }

  editTeamDetailIcon = this.resources.editIcon;

  ngOnInit() {
    
    if (this.keychain.loggedInUser.role == TeamMemberRole.ChiefFinancialPlanner) {
      this.isChief = true
    }

    this.cols = [
      { header: 'Name' },
      { header: 'Role' },
      { header: 'Email' },
      { header: 'Mobile' },
      { header: 'Date Of Joining' },
      { header: 'Date Of Birth' },
      { header: 'Qualification' },
      { header: 'Certification' }
    ];

    this.fetchAllTeamPlanners();
  }


  ngDoCheck() {
    const height = window.outerHeight;
    const anchorEl = this.elementRef.nativeElement.querySelector('.ui-table-scrollable-body');
    if (anchorEl) {
      anchorEl.setAttribute('style', 'max-height:' + height / 2 + 'px !important');
    }
  }

  async fetchAllTeamPlanners() {

    try {
      this.messageService.sendMessage('show-loading');

      const responseTeam = await this.plannermanagement.request(RequestMethod.Get, '/admin', null);
      this.teamList = responseTeam.admins;
      this.tempTeamList = this.teamList;
      this.messageService.sendMessage('hide-loading');
    } catch (error) {
      this.messageService.sendMessage('hide-loading');
      this.teamListErrorStatus = true;
      this.teamListSuccessStatus = false;
      this.isErrorOccured = true
      this.changeDetector.detectChanges()
      this.errorHandling.message = error.message
      this.errorHandling.buttonText = "Retry"
    }
  }

  displayMemberRole(teamRoleNumber) {
    return TeamMemberRoleUtils.getTeamMemberRoleText(teamRoleNumber);
  }

  async reinvite(email) {
    try {

      const responseTeam = await this.plannermanagement.request(RequestMethod.Post, 'admin/re-invite', { 'email': email });
      this.loadingOnSubmit = false;
      this.teamListErrorStatus = false;
      this.teamListSuccessStatus = true;
      this.teamListMessage = responseTeam.message;
      this.fetchAllTeamPlanners();
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Succes', detail: this.teamListMessage });

    } catch (error) {
      this.teamListErrorStatus = true;
      this.teamListSuccessStatus = false;
      this.teamListMessage = error.message;
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Error', detail: this.teamListMessage });

    }
  }

  async deletePlanner(plannerId) {
    if (confirm('Are you sure you want to delete this planner?') === true) {
      try {

        const responseTeam = await this.plannermanagement.request(RequestMethod.Delete, 'user', [plannerId]);
        this.teamListErrorStatus = false;
        this.teamListSuccessStatus = true;
        this.teamListMessage = responseTeam.message;
        this.fetchAllTeamPlanners();
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Succes', detail: this.teamListMessage });

      } catch (error) {
        this.teamListErrorStatus = true;
        this.teamListSuccessStatus = false;
        this.teamListMessage = error.message;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error', detail: this.teamListMessage });

      }
    }
  }

  async deletePlanners() {

    let selectedTeamMembersArray = this.teamList.filter(team => team.isSelected).map(team => team._id)
    if (selectedTeamMembersArray.length > 0) {
      if (confirm('Are you sure you want to delete the selected planners?') === true) {
        try {

          const responseTeam = await this.plannermanagement.request(RequestMethod.Delete, 'user', selectedTeamMembersArray);
          this.teamListErrorStatus = false;
          this.teamListSuccessStatus = true;
          this.teamListMessage = responseTeam.message;
          this.fetchAllTeamPlanners();
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Succes', detail: this.teamListMessage });

        } catch (error) {
          this.teamListErrorStatus = true;
          this.teamListSuccessStatus = false;
          this.teamListMessage = error.message;
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error', detail: this.teamListMessage });

        }
      }
    }
  }

  editTeamDetail() {
    if (!this.editEnable) {
      this.editButtonText = 'Cancel';
      this.editEnable = true;
      window.scroll(0, 0);
      const contanierHolder = document.querySelector('.ui-table-scrollable-body');
      contanierHolder.scrollLeft = 0;
    } else {
      this.editButtonText = 'Edit';
      this.editEnable = false;
    }
  }

  selectDeselectAll(event) {
    const count = 0;
    if (event.target.checked) {
      this.teamList.map((x) => {
        if (x.role != this.teamRole.ChiefFinancialPlanner) {
          x.isSelected = true;
        }
        return x
      });
      this.countSelected();
    } else {
      this.teamList.map((x) => {
        x.isSelected = false;
        return x
      });
      this.countSelected();
    }
  }

  countSelected() {
    this.selectedClientCount = this.teamList.filter(function (x) { return x.isSelected; }).length;
  }

  searchTeamList() {

    const key = this.searchTerm.toLowerCase();
    if (this.sortByTeamType == '') {
      let phoneNumberFilter
      this.teamList = this.tempTeamList.filter((team) => {

        if (team.ph) {

          phoneNumberFilter = this.matchString(team.ph.ph, key)
        }
        return this.matchString(team.name.firstName, key) || this.matchString(team.email, key) || phoneNumberFilter;
      });
    } else {
      this.teamList = this.tempTeamList.filter((team) => { return (this.matchString(team.name.firstName, key) && team.role == this.sortByTeamType); });
    }

  }

  matchString(keyword, key) {
    return new RegExp(key, 'gi').test(keyword.trim().toLowerCase())
  }

  teamMemberDetails(admin) {
    this.router.navigate(['auth/admin/' + admin._id]);
  }

}
