import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { RequestMethod } from '@angular/http';
import { JsonConvert } from '../../model/parsers/json-convert';
import { Income } from '../../model/income/income';


@Injectable()
export class CashflowRepository {


    constructor(private httpService: HttpService) {

    }


    public async getTotalCashflow(clientId) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/cashflow', null);
            return response.cashflow;
        } catch (error) {
            throw error;
        }
    }


    public async getIncomes(clientId) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/incomes-grouped', null);
            return response.incomes;
        } catch (error) {
            throw error;
        }
    }


    public async getExpenses(clientId) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/expenses-grouped', null);
            return response.expenses;
        } catch (error) {
            throw error;
        }
    }


    public async getIncomesBasedOnKind(clientId, kind) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/income?kind=' + kind, null);
            const parser = new JsonConvert();
            return parser.deserialize(response.incomes, Income);
        } catch (error) {
            throw error;
        }
    }


    public async deleteIncome(clientId, id) {
        try {
            const response = await this.httpService.request(RequestMethod.Delete, 'client/' + clientId + '/incomes', [id]);
            return response;
        } catch (error) {
            throw error;
        }
    }


    async deleteSelectedIncomes(clientId, selectedIncomes) {
        try {
            const response = await this.httpService.request(RequestMethod.Delete, 'client/' + clientId + '/incomes', selectedIncomes);
            return response;
        } catch (error) {
            throw error;
        }

    }

}
