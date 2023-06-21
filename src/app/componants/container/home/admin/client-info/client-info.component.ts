import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TeamMemberRole, TeamMemberRoleUtils } from '../../../../../model/enum/team-member-role.enum';
import { Message } from 'primeng/primeng';
import { RequestMethod } from '@angular/http';
import { HttpService } from '../../../../../services/http.service';


@Component({
    selector: 'app-client-info',
    templateUrl: './client-info.component.html',
    styleUrls: ['./client-info.component.css']
})


export class ClientInfoComponent implements OnInit {

    public teamMemberRole = TeamMemberRole;
    public msgs: Message[] = [];
    private clientListErrorStatus = false;
    private clientListSuccessStatus = false;
    private clientListMessage = '';

    constructor(private plannermanagement: HttpService,
        public dialogRef: MatDialogRef<ClientInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    ngOnInit() {
    }


    async assignPlannerToClient(event, clientId, plannerId, role) {

        try {
            // if (role == TeamMemberRole.ParaPlanner) {
            //     let selectedPlanner = this.data.paraFinancialPlanner.find(planner => plannerId == planner._id);
            //     role = selectedPlanner.role;
            // }
            const response = await this.plannermanagement.request(RequestMethod.Post, 'admin/assign', { 'clientId': clientId, 'adminId': event.target.value, 'role': role });
            this.clientListErrorStatus = false;
            this.clientListSuccessStatus = true;
            this.clientListMessage = response.message;
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success', detail: this.clientListMessage });
        } catch (error) {
            this.clientListErrorStatus = true;
            this.clientListSuccessStatus = false;
            this.clientListMessage = error.message;
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error', detail: this.clientListMessage });
        }
    }


    didClickCloseDialog() {
        this.dialogRef.close();
    }

}
