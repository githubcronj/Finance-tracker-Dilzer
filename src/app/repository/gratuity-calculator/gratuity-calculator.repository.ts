import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { RequestMethod } from '@angular/http';


@Injectable()
export class GratuityCalculatorRepository {

    constructor(private httpService: HttpService) {

    }


    async calculateGratuity(gratuity, clientId, ownerId) {
        try {
            const response = await this.httpService.request(RequestMethod.Post, 'client/' + clientId + '/' + ownerId + '/calculator/calculateGratuity', gratuity);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async calculateSpouseGratuity(gratuity, clientId, ownerId) {
        try {
            const response = await this.httpService.request(RequestMethod.Post, 'client/' + clientId + '/' + ownerId + '/calculator/calculateSpouseGratuity', gratuity);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getInitialGratuityData(clientId, ownerId) {
        try {
            const response = await this.httpService.request(RequestMethod.Post, 'client/' + clientId + '/' + ownerId + '/calculator/getGratuityData', null);
            return response;
        } catch (error) {
            if (error.status && error._body) {
                let body = error.json();
                if (body.message) {
                    throw error;
                } else {
                    return body;
                }
            } else {
                throw error;
            }
        }
    }

}
