import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { RequestMethod } from '@angular/http';
import { Goal } from '../../model/goal/goal';
import { JsonConvert } from '../../model/parsers/json-convert';


@Injectable()
export class GoalRepository {

    constructor(private httpService: HttpService) {

    }

    async getAllGoals(clientId) {
        try {
            const response = await this.httpService.request(RequestMethod.Get, 'client/' + clientId + '/goal', null);
            const parser = new JsonConvert();
            const goals = parser.deserializeArray(response.goals, Goal);
            return goals;
        } catch (error) {
            throw error;
        }
    }

    async mapAssetsToGoal(clientId, goalId, assetIds) {
        try {
            const response = await this.httpService.request(RequestMethod.Post, '/client/' + clientId + '/goal/' + goalId + '/map', {assets: assetIds});
            const parser = new JsonConvert();
            const goal = parser.deserializeObject(response.goal, Goal);
            return goal;
        } catch (error) {
            throw error;
        }
    }

    async saveMappedAssets (clientId, finalGoals) {
        try {
            const response = await this.httpService.request(RequestMethod.Post, 'client/' + clientId + '/goals-funding', finalGoals);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteGoal(clientId, goalId) {
        try {
            const response = await this.httpService.request(RequestMethod.Delete, 'client/' + clientId + '/goals', [goalId]);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteSelectedGoals(clientId, selectedGoals) {
        try {
            const response = await this.httpService.request(RequestMethod.Delete, 'client/' + clientId + '/goals', selectedGoals);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async swapGoalPriority(clientId, goals) {
        try {
            const response = await this.httpService.request(RequestMethod.Post, 'client/' + clientId + '/goal/swap-goal-priority', goals);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async analyseGoalScenario(clientId, goalId, analyseGoalData) {
        try {
            const response = await this.httpService.request(RequestMethod.Post, '/client/' + clientId + '/goal/' + goalId + '/scenario', analyseGoalData);
            const parser = new JsonConvert();
            const goal = parser.deserializeObject(response.goal, Goal);
            return goal;
        } catch (error) {
            throw error;
        }
    }

}
