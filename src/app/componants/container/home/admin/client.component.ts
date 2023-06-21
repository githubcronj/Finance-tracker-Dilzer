import { Component, OnInit, DoCheck, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { ResourcesService } from '../../../../services/resources.service';
import { RequestMethod } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Admin } from '../../../../model/admin';
import { Client } from '../../../../model/client';
import { TeamMemberRole, TeamMemberRoleUtils } from '../../../../model/enum/team-member-role.enum';
import { KeychainService } from '../../../../services/keychain.service';
import { JsonConvert } from '../../../../model/parsers/json-convert';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MessageService } from '../../../../services/message.service';
import { ActivityLogComponent } from '../../activity-log/activity-log.component';
import { ClientInfoComponent } from '../admin/client-info/client-info.component';
import { ErrorHandlingComponent } from '../../../error-handling/error-handling.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, DoCheck {

  @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

  isChief = false;
  editEnable = false;
  clientList: Array<Client>;
  teamList: Array<Admin>;
  clientListErrorStatus = false;
  clientListSuccessStatus = false;
  clientListMessage = '';
  msgs: Message[] = [];
  teamMemberRole = TeamMemberRole;
  selectedClientCount = 0;
  searchTerm = '';
  tempClientList: any;
  sortByClientType = '';
  chiefFinancialPlanner = [];
  paraFinancialPlanner = [];
  operationalRelationshipManager = [];
  salesRelationshipManager = [];
  researchRelationshipManager = [];
  seniorAssociateFinancialPlanner = [];
  editButtonText = 'Edit';
  cols: any[];
  isErrorOccured = false;

  constructor(private plannermanagement: HttpService,
    private keychain: KeychainService,
    private router: Router,
    private elementRef: ElementRef,
    public resources: ResourcesService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef
  ) { }

  editClientDetailIcon = this.resources.editIcon;

  ngOnInit() {
    if (this.keychain.loggedInUser.role == TeamMemberRole.ChiefFinancialPlanner) {
      this.isChief = true
    }

    this.cols = [
      { header: 'Name' },
      { header: 'Risk Profile' },
      { header: 'AUM' },
      { header: 'Debt/Equity Allocation' },
      { header: 'Stage Of Workflow' }
    ];

    this.getData();

  }

  ngDoCheck() {
    const height = window.outerHeight;
    const anchorEl = this.elementRef.nativeElement.querySelector('.ui-table-scrollable-body');
    if (anchorEl) {
      anchorEl.setAttribute('style', 'max-height:' + height / 2 + 'px !important');
    }
  }

  async getData(shouldFetchTeam = true, shouldFetchClients = true) {
    try {

      this.messageService.sendMessage('show-loading');
      if (shouldFetchClients) {
        const responseClients = await this.plannermanagement.request(RequestMethod.Get, 'client', null);
        const parser = new JsonConvert()
        this.clientList = parser.deserialize(responseClients.clients, Client);
        this.tempClientList = this.clientList;

      }
      if (shouldFetchTeam) {
        const responseTeam = await this.plannermanagement.request(RequestMethod.Get, '/admin', null);
        const parser = new JsonConvert()
        this.teamList = parser.deserialize(responseTeam.admins, Admin);

      }

      for (let client of this.clientList) {
        client.mapPlannerRoles(this.teamList)
      }

      for (let team of this.teamList) {
        if (team.role == TeamMemberRole.ChiefFinancialPlanner) {
          this.chiefFinancialPlanner.push(team)
        } else if (team.role == TeamMemberRole.ParaPlanner || team.role == TeamMemberRole.SeniorParaPlanner) {
          this.paraFinancialPlanner.push(team)
        } else if (team.role == TeamMemberRole.ResearchRelationshipManager) {
          this.researchRelationshipManager.push(team)
        } else if (team.role == TeamMemberRole.OperationalRelationshipManager) {
          this.operationalRelationshipManager.push(team)
        } else if (team.role == TeamMemberRole.SalesRelationshipManager) {
          this.salesRelationshipManager.push(team)
        }
      }
      this.messageService.sendMessage('hide-loading');
    } catch (error) {
      this.messageService.sendMessage('hide-loading');
      this.clientListErrorStatus = true;
      this.clientListSuccessStatus = false;
      this.isErrorOccured = true
      this.changeDetector.detectChanges()
      this.errorHandling.message = error.message
      this.errorHandling.buttonText = "Retry"
    }
  }


  async deleteClient(clientId) {
    if (confirm('Are you sure you want to delete this client?') === true) {
      try {

        const response = await this.plannermanagement.request(RequestMethod.Delete, 'user', [clientId]);
        this.clientListErrorStatus = false;
        this.clientListSuccessStatus = true;
        this.clientListMessage = response.message;
        this.getData(false, true);
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Succes', detail: this.clientListMessage });

      } catch (error) {
        this.clientListErrorStatus = true;
        this.clientListSuccessStatus = false;
        this.clientListMessage = error.message;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error', detail: this.clientListMessage });

      }
    }
  }

  async deleteClients() {

    let selectedClientsArray = this.clientList.filter(client => client.isSelected).map(client => client._id)
    if (selectedClientsArray.length > 0) {
      if (confirm('Are you sure you want to delete the selected clients?') === true) {
        try {

          const response = await this.plannermanagement.request(RequestMethod.Delete, 'user', selectedClientsArray);
          this.clientListErrorStatus = false;
          this.clientListSuccessStatus = true;
          this.clientListMessage = response.message;
          this.getData(false, true);
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: 'Succes', detail: this.clientListMessage });

        } catch (error) {
          this.clientListErrorStatus = true;
          this.clientListSuccessStatus = false;
          this.clientListMessage = error.message;
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Error', detail: this.clientListMessage });

        }
      }
    }
  }

  async assignPlannerToClient(event, clientId, plannerId, role) {
    try {
      if (role == TeamMemberRole.ParaPlanner) {
        let selectedPlanner = this.paraFinancialPlanner.find(planner => plannerId == planner._id)
        role = selectedPlanner.role
      }
      const response = await this.plannermanagement.request(RequestMethod.Post, 'admin/assign', { 'clientId': clientId, 'adminId': plannerId, 'role': role });
      this.clientListErrorStatus = false;
      this.clientListSuccessStatus = true;
      this.clientListMessage = response.message;
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Succes', detail: this.clientListMessage });


    } catch (error) {
      this.clientListErrorStatus = true;
      this.clientListSuccessStatus = false;
      this.clientListMessage = error.message;
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Error', detail: this.clientListMessage });

    }
  }

  clientDetails(client) {

    if (client.isProspect()) {
      this.router.navigate(['auth/admin/prospect-details/' + client._id]);
    } else {
      this.router.navigate(['auth/admin/client-details/' + client._id]);
    }

  }

  editClientDetail() {
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
      this.clientList.map((x) => {
        x.isSelected = true;
        return x
      });
      this.countSelected();
    } else {
      this.clientList.map((x) => {
        x.isSelected = false;
        return x
      });
      this.countSelected();
    }
  }

  countSelected() {
    this.selectedClientCount = this.clientList.filter(function (x) { return x.isSelected; }).length;
  }

  searchClientList() {

    const key = this.searchTerm.toLowerCase();


    this.clientList = this.tempClientList.filter(client => {

      let clientLastNameFilter;
      if (client.name.lastName) {
        clientLastNameFilter = this.matchString(client.name.lastName, key);
      }
      let found = this.matchString(client.name.firstName, key) || clientLastNameFilter || this.matchString(client.email, key) || this.matchString(client.ph.ph, key)
      if (found) {
        if (this.sortByClientType == 'clients') {

          return !client.isProspect()

        } else if (this.sortByClientType == 'prospect') {

          return client.isProspect()

        } else {
          return true
        }
      } else {
        return false
      }

    });
  }

  matchString(keyword, key) {
    return new RegExp(key, 'gi').test(keyword.trim().toLowerCase())
  }


  openDialog(component, data, width, height): void {
    let dialogRef = this.dialog.open(component, {
      width: width,
      height: height,
      data: data
    });
  }


  didOpenActivityLogDialog(client): void {
    this.openDialog(ActivityLogComponent, client, '400px', '400px');
  }


  didOpenClientInfoDialog(client) {

    let data = {
      client: client,
      chiefFinancialPlanner: this.chiefFinancialPlanner,
      paraFinancialPlanner: this.paraFinancialPlanner,
      operationalRelationshipManager: this.operationalRelationshipManager,
      salesRelationshipManager: this.salesRelationshipManager,
      researchRelationshipManager: this.researchRelationshipManager,
      seniorAssociateFinancialPlanner: this.seniorAssociateFinancialPlanner
    }

    this.openDialog(ClientInfoComponent, data, '600px', '500px');
  }

  retry() {
    this.getData();
  }

}
