import { Component, OnInit } from '@angular/core';
import { KeychainService } from '../../services/keychain.service';
import { HttpService } from '../../services/http.service';
import { RequestMethod } from '@angular/http';
import { JsonConvert } from '../../model/parsers/json-convert';
import { User } from '../../model/user';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {


  isLoggedIn = false

  constructor(private keychain: KeychainService, private httpService: HttpService
  ) { }


  async ngOnInit() {
    await this.autoAuthenticate()
  }

  async autoAuthenticate() {
    try {


      if (this.keychain.loggedInUser == undefined && this.keychain.isLoggedIn()) {

        const response = await this.httpService.request(RequestMethod.Post, "auto-authenticate", null);
        let parser = new JsonConvert()
        let user = parser.deserialize(response.user, User)
        this.keychain.loggedInUser = user

      }

      this.isLoggedIn = true

    } catch (error) {
      this.isLoggedIn = false
    }

  }

}
