import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { RequestMethod } from '@angular/http';
import { Client } from '../../model/client'
import { JsonConvert } from '../../model/parsers/json-convert';


@Injectable()
export class UserRepository {

    constructor(private httpService: HttpService) {

    }

    async getClient(clientId) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId, null);
            const parser = new JsonConvert();
            return parser.deserialize(response.client, Client);
        } catch (error) {
            throw error;
        }
    }

}
