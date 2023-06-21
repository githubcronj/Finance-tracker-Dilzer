import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { RequestMethod } from '@angular/http';


@Injectable()
export class SettingsRepository {

    constructor(private httpService: HttpService) {

    }


    async getSettings() {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'settings', null);
            return response.settings;
        } catch (error) {
            throw error;
        }
    }

    async saveRiskProfileSettings(riskProfileSettingList) {
        try {
            const response = await this.httpService.request(RequestMethod.Put, `settings/riskProfile`, riskProfileSettingList);
            return response;
        } catch (error) {
            throw error;
        }

    }

}