import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service'
import { RequestMethod } from '@angular/http';


@Injectable()
export class EmergencyFundRepository {


    constructor(private httpService: HttpService) { }


    async getEmergencyFundDetails(clientId) {
        try {
            const url = 'client/' + clientId + '/calculator/emergencyFund';
            const response = await this.httpService.request(RequestMethod.Post, url, null);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateEmergencyFund(clientId,emergencyFundRequired){
        try{
            const url = 'client/'+clientId+'/calculator/emergencyFundUpdate';
            const response = await this.httpService.request(RequestMethod.Post, url, emergencyFundRequired);
            return response;
        }catch(error){
            throw error;
        }
    }

}