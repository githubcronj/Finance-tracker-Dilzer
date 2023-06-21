import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequestMethod, ResponseContentType } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { JsonConvert } from '../../../model/parsers/json-convert';
import { Goal } from '../../../model/goal/goal';
import { Client } from '../../../model/client';
import { GoalType } from '../../../model/enum/goal-type.enum';
import { NavbarComponent } from '../navbar/navbar.component';
import { KeychainService } from '../../../services/keychain.service';
import { ResourcesService } from '../../../services/resources.service';
import { SoleSurvivorService } from '../../../services/soleSurvivor.service';
import { saveAs } from 'file-saver';
import 'rxjs/Rx';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { MessageService } from '../../../services/message.service';


@Component({
    selector: 'app-goal',
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.css']
})
export class GoalComponent implements OnInit {

    userGoals;
    preLoader;
    @ViewChild('navbar') navbar: NavbarComponent;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;

    editGoalInformation = '';
    clientId;
    goalId;
    describeGoalRowHideShow = false
    userDetails
    isErrorOccured = false
    GoalType = GoalType
    soleSurvivorStartDate
    soleSurvivorEndDate
    addButtonText;
    soleSurvivorHideShow = false
    msgs = [];
    goalInformation = new Goal();
    rateOfReturnButton;
    ownerOfResourceList;
    ownerName;

    constructor(
        public keychainService: KeychainService,
        private router: Router,
        private route: ActivatedRoute,
        private httpService: HttpService,
        public resources: ResourcesService,
        private changeDetector: ChangeDetectorRef,
        private soleSurvivorService: SoleSurvivorService,
        private messageService: MessageService
    ) {
    }

    async ngOnInit() {
        this.soleSurvivorService.inflationRate = undefined;
        this.loadData()

    }

    async loadData() {

        try {

            this.navbar.isBorderEnabled = true;
            this.clientId = this.route.snapshot.params['clientId'];
            this.goalId = this.route.snapshot.params['goalId'];
            this.editGoalInformation = '/auth/client/' + this.clientId + '/edit-goal/' + this.goalId;
            this.addButtonText = "Add"

            this.messageService.sendMessage('show-loading');
            const parser = new JsonConvert()
            const ClientResponse = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId, null);
            this.userDetails = parser.deserialize(ClientResponse.client, Client);
            this.navbar.title = this.userDetails.name.fullName()
            this.navbar.subTitle = this.userDetails.email;
            this.navbar.routeBackTitle = 'Goals'

            this.ownerOfResourceList = this.userDetails.ownerOfResourceList();


            if (this.keychainService.isLoggedInAsAdmin()) {

                this.navbar.routeBackPath = `/auth/admin/client-details/${this.clientId}`;

            } else {
                this.navbar.routeBackPath = "/auth/home";

            }
            this.navbar.routeBackQueryParams = { selected: 4 };

            const response = await this.httpService.request(RequestMethod.Get, 'client/' + this.clientId + '/goal/' + this.goalId, null);
            this.goalInformation = parser.deserialize(response.goal, Goal);
            this.hideShowDescribeGoalRow()
            this.setButtonTitle()

            if (this.goalInformation.owners.length > 1) {
                this.ownerName = this.getOwnerName(this.goalInformation.owners[0] + '&' + this.goalInformation.owners[1]);
            } else {
                this.ownerName = this.getOwnerName(this.goalInformation.owners[0])
            }

            if (this.goalInformation.soleSurvivor.amount) {
                this.addButtonText = ""
            } else {
                this.addButtonText = "Add"
            }

            this.getLifeSpanDateOfClientAndSpouse()

            this.isErrorOccured = false
            this.messageService.sendMessage('hide-loading');

        } catch (error) {
            this.isErrorOccured = true
            this.messageService.sendMessage('hide-loading');
            this.changeDetector.detectChanges()

            this.errorHandling.message = error.message
        }
    }

    retry() {
        this.loadData()
    }

    getOwnerName(id) {
        for (let owner of this.ownerOfResourceList) {
            if (id == owner.key) {

                return owner.value;
            }
        }
    }
    getLifeSpanDateOfClientAndSpouse() {
        const clientLifeSpan = new Date(this.userDetails.dob);
        clientLifeSpan.setFullYear(clientLifeSpan.getFullYear() + this.userDetails.lifeExpectancy);

        const spouseLifeSpan = new Date(this.userDetails.spouse.dob);
        spouseLifeSpan.setFullYear(spouseLifeSpan.getFullYear() + this.userDetails.spouse.lifeExpectancy);

        if (clientLifeSpan > spouseLifeSpan) {
            this.soleSurvivorHideShow = false
        } else {
            this.soleSurvivorHideShow = true
        }

    }

    hideShowDescribeGoalRow() {
        if (this.goalInformation.kind == String(GoalType.Other)) {
            this.describeGoalRowHideShow = true
        } else {
            this.describeGoalRowHideShow = false
        }
    }

    editRateOfReturns(goalCorpusRateOfReturnId) {
        this.router.navigate(['/auth/client/' + this.clientId + '/goal/' + this.goalId + '/goalCorpusRateOfReturn/' + goalCorpusRateOfReturnId]);
    }

    async deleteRateOfReturn(rateOfReturnId) {
        if (confirm('Are you sure you want to delete this rate of return?') == true) {
            try {
                const response = await this.httpService.request(RequestMethod.Delete, 'client/' + this.clientId + '/goal/' + this.goalId + '/rateOfReturn/' + rateOfReturnId, null);
                const parser = new JsonConvert()
                this.goalInformation = parser.deserialize(response.goal, Goal);
                this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
                this.setButtonTitle()
            } catch (error) {

                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }
            }
        }
    }

    async deleteSoleSurvivor(id) {
        if (confirm('Are you sure you want to delete this Sole survivor expense?') == true) {
            try {
                const response = await this.httpService.request(RequestMethod.Delete, 'client/' + this.clientId + '/goal/' + this.goalId + '/sole-survivor/' + id, [id]);
                const parser = new JsonConvert()
                this.goalInformation = parser.deserialize(response.goal, Goal);
                this.addButtonText = "Add"
                this.msgs = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully.' }];
            } catch (error) {

                if (error.message) {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: error.message }];
                } else {
                    this.msgs = [{ severity: 'error', summary: 'Error', detail: 'Something went wrong.' }];
                }
            }
        }
    }

    setButtonTitle() {
        if (this.goalInformation.rateOfReturns.length > 0) {
            this.rateOfReturnButton = 'Add New Rate of Return';
        } else {
            this.rateOfReturnButton = 'Add Rate of Return';
        }
    }


}


