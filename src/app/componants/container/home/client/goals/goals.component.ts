import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { Client } from '../../../../../model/client';
import { UserRepository } from '../../../../../repository/user/user.repository';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../../../services/message.service';
import { Location } from '@angular/common';
import { KeychainService } from '../../../../../services/keychain.service';
import { ErrorHandlingComponent } from '../../../../error-handling/error-handling.component';
import { SidemenuComponent } from '../../../sidemenu/sidemenu.component';


@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html',
    styleUrls: ['./goals.component.css']
})


export class GoalsComponent implements OnInit, OnDestroy {


    @Input('clientId') clientId: string;
    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @ViewChild('sidemenu') sidemenu: SidemenuComponent;

    isErrorOccured = false;
    activeTab = 0;
    submenuList = ['Goals', 'Goal Funding', 'Goal Cost', 'Scenario Analysis'];
    showDashboard = false;
    client: Client;
    eventListener


    constructor(private httpService: HttpService,
        private messageService: MessageService,
        private changeDetector: ChangeDetectorRef,
        private router: Router,
        private keychainService: KeychainService,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private userRepository: UserRepository,
    ) { }


    async ngOnInit() {
        this.changeDetector.detectChanges()

        if (this.activatedRoute.snapshot.params['clientId']) {
            this.clientId = this.activatedRoute.snapshot.params['clientId'];
        }

        await this.loadData()
        this.eventListener = this.activatedRoute.queryParams.subscribe(params => {

            if (params['selectedSubIndex']) {
                this.activeTab = params['selectedSubIndex'];
                this.sidemenu.setInitialData(this.submenuList);
                this.sidemenu.activeTab = this.activeTab;
                this.changeDetector.detectChanges();
            } else {
                this.activeTab = 0;
                this.changeDetector.detectChanges();
            }
        })
        if (!this.keychainService.isLoggedInAsAdmin()) {
            this.submenuList = ['Goals', '', 'Goal Cost', ''];
        }
        this.sidemenu.setInitialData(this.submenuList);
        this.sidemenu.activeTab = this.activeTab;
    }


    private async loadData() {

        try {
            this.messageService.sendMessage('show-loading');
            this.client = await this.userRepository.getClient(this.clientId);

            if (this.client.pan == undefined || this.client.companyAddress.addressLine1 == undefined || this.client.companyAddress.country == undefined || this.client.companyAddress.city == undefined) {
                this.isErrorOccured = true;
                this.changeDetector.detectChanges();
                this.errorHandling.message = "Personal Information is not filled";
                this.errorHandling.buttonText = "Click to fill Personal Information";
                this.showDashboard = false;
            } else if (this.client && this.client.riskProfile.name == undefined) {
                this.isErrorOccured = true;
                this.changeDetector.detectChanges();
                this.errorHandling.message = "You have not analysed your Risk Profile";
                this.errorHandling.buttonText = "Click to analyse yor Risk Profile";
                this.showDashboard = false;
            } else {
                this.showDashboard = true;
            }

            this.messageService.sendMessage('hide-loading');

        } catch (error) {
            this.messageService.sendMessage('hide-loading');
            this.isErrorOccured = true;
            this.changeDetector.detectChanges();
            this.errorHandling.message = error.message;
            this.errorHandling.buttonText = "Retry";
            this.showDashboard = false;
        }

    }


    detectTabChange() {
        this.activeTab = this.sidemenu.activeTab;
        this.changeDetector.detectChanges();
        this.router.navigate(['/auth/admin/client-details/' + this.clientId], { queryParams: { selected: 4, selectedSubIndex: this.activeTab } });
    }


    retry() {
        if (this.client == undefined) {
            this.loadData();
        } else if (this.client.pan == undefined) {
            this.router.navigate(['/auth/client/' + this.clientId + '/personal-info']);
        } else if (this.client.riskProfile.name == undefined) {
            this.router.navigate(['/auth/admin/client-details/' + this.clientId], { queryParams: { selected: 1 } });
        }
    }


    ngOnDestroy() {
        this.changeDetector.detach();
        if (this.eventListener) {
            this.eventListener.unsubscribe();
        }
    }

}
