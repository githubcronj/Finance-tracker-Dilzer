import { Injectable } from '@angular/core';
import { SettingsRepository } from '../../../../repository/settings/settings.repository'

@Injectable()
export class RiskProfileSettingViewModel {

    private riskProfileSettings = [];
    public riskProfileSettingsList = [];

    constructor(private settingsRepository: SettingsRepository) {

    }

    async getSettings() {

        try {
            let response = await this.settingsRepository.getSettings();
            this.riskProfileSettings = response.riskProfile;

            this.riskProfileSettingsList = this.riskProfileSettings;

        } catch (error) {
            throw error;
        }
    }

    async saveRiskProfileSettings() {

        try {
            let response = await this.settingsRepository.saveRiskProfileSettings(this.riskProfileSettingsList);
            return response;

        } catch (error) {
            throw error;
        }
    }

}