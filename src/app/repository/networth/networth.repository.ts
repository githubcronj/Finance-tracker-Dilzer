import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { RequestMethod } from '@angular/http';
import { JsonConvert } from '../../model/parsers/json-convert';
import { Asset } from '../../model/asset/asset';
import { Liability } from '../../model/liability/liability';

@Injectable()
export class NetworthRepository {

    constructor(private httpService: HttpService) {

    }

    async getTotalNetworth(clientId) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/networth', null);
            return response.networth;
        } catch (error) {
            throw error;
        }
    }


    async getFinancialAssets(clientId) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/financial-assets', null);
            return response.category;
        } catch (error) {
            throw error;
        }
    }

    async getOtherAssets(clientId) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/other-assets', null);
            return response.category;
        } catch (error) {
            throw error;
        }
    }

    async getAssets(clientId, kind) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/asset?kind=' + kind, null);
            const parser = new JsonConvert()
            return parser.deserialize(response.assets, Asset);
        } catch (error) {
            throw error;
        }
    }

    async deleteAsset(clientId, id) {
        try {
            const response = await this.httpService.request(RequestMethod.Delete, 'client/' + clientId + '/assets', [id]);
            return response

        } catch (error) {
            throw error;
        }
    }

    async deleteSelectedAssets(clientId, selectedAssetsArray) {


        try {
            const response = await this.httpService.request(RequestMethod.Delete, 'client/' + clientId + '/assets', selectedAssetsArray);
            return response;

        } catch (error) {
            throw error;
        }

    }

    async getLiabilitiesCategory(clientId) {

        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/liabilities-grouped', null);
            return response.liabilities
        } catch (error) {
            throw error;
        }
    }

    async getLiabilities(clientId, kind) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/liability?kind=' + kind, null);
            const parser = new JsonConvert()
            return parser.deserialize(response.liabilities, Liability);
        } catch (error) {
            throw error;
        }
    }

    async getAllLiabilities(clientId) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/liability', null);
            const parser = new JsonConvert()
            return parser.deserialize(response.liabilities, Liability);
        } catch (error) {
            throw error;
        }
    }

    async deleteLiability(clientId, id) {
        try {
            const response = await this.httpService.request(RequestMethod.Delete, 'client/' + clientId + '/liabilities', [id]);
            return response
        } catch (error) {
            throw error;
        }

    }


    async deleteSelectedLiabilities(clientId, selectedLiabilitiesArray) {

        try {
            const response = await this.httpService.request(RequestMethod.Delete, 'client/' + clientId + '/liabilities', selectedLiabilitiesArray);
            return response;

        } catch (error) {
            throw error;
        }

    }

    async getAllAssets(clientId) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/asset', null);
            const parser = new JsonConvert();
            const assets = parser.deserializeArray(response.assets, Asset);
            return assets;

        } catch (error) {
            throw error;
        }
    }

}
