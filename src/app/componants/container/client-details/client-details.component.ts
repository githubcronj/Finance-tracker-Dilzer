import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { KeychainService } from '../../../services/keychain.service';
import { User } from '../../../model/user';
import { ClientHomeComponent } from '../home/client/client-home.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild("clientHome") clientHome: ClientHomeComponent

  constructor(
    private keychain: KeychainService,
    private messageService: MessageService,
    private route: ActivatedRoute) { }


  userId = undefined

  async ngOnInit() {
    if (this.route.snapshot.params['clientId']) {
      this.userId = this.route.snapshot.params['clientId'];
    }
  }

  async ngAfterViewInit() {

    if (this.clientHome != undefined && this.userId != undefined) {
      this.clientHome.shouldShowNavBar = true
      this.clientHome.reloadForClientId(this.userId)
    }

  }


}
