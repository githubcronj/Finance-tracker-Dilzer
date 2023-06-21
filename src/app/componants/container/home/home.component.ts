import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { KeychainService } from '../../../services/keychain.service';
import { User } from '../../../model/user';
import { ClientHomeComponent } from './client/client-home.component';

@Component({
  selector: 'home-container',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild("clientHome") clientHome: ClientHomeComponent

  constructor(public keychain: KeychainService
  ) { }


  async ngOnInit() {


  }

  async ngAfterViewInit() {
    
    if(this.clientHome != undefined){
      this.clientHome.reloadForClientId(this.keychain.userId)
    }

  }


}
