import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';
import { KeychainService } from '../../services/keychain.service';
import { Router } from '@angular/router';
import { TeamMemberRole, TeamMemberRoleUtils } from '../../model/enum/team-member-role.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isChief = false
  constructor(public repository: KeychainService, private router: Router, public resources: ResourcesService) { }

  ngOnInit() {

    if (this.repository.loggedInUser.role == TeamMemberRole.ChiefFinancialPlanner) {
      this.isChief = true
    }

  }


  logoutUser() {

    this.router.navigate(['login']);
    this.repository.clear()

  }

}
