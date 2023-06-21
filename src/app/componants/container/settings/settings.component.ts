import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ErrorHandlingComponent } from '../../error-handling/error-handling.component'
import { Router } from '@angular/router';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MessageService } from '../../../services/message.service';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

    @ViewChild('errorHandling') errorHandling: ErrorHandlingComponent;
    @ViewChild('sidemenu') sidemenu: SidemenuComponent;
    @ViewChild('navbar') navbar: NavbarComponent;

    clientId;
    isErrorOccured = false;
    activeTab = 0;
    submenuList = ['Asset Classes', 'Risk Profile'];

    constructor(private changeDetector: ChangeDetectorRef,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        try {
            this.messageService.sendMessage('hide-loading');
            this.navbar.routeBackTitle = 'Home';
            this.navbar.title = "Settings"
            this.navbar.isBorderEnabled = true;
            this.navbar.routeBackPath = '/auth/home'
            this.sidemenu.setInitialData(this.submenuList);
        }
        catch (error) {
            this.messageService.sendMessage('hide-loading');
            this.isErrorOccured = true
            this.changeDetector.detectChanges()
            this.errorHandling.message = error.message
            this.errorHandling.buttonText = "Retry"
        }
    }

    detectTabChange() {
        this.activeTab = this.sidemenu.activeTab;
        this.changeDetector.detectChanges();
    }


    retry() {
        this.loadData()
    }
}

