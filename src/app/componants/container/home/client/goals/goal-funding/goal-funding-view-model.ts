import { Injectable } from '@angular/core';
import { GoalType, GoalTypeUtils } from '../../../../../../model/enum/goal-type.enum';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter';
import { Asset } from '../../../../../../model/asset/asset';
import { Goal } from '../../../../../../model/goal/goal';
import { AssetsViewModel } from './assets-view-model';
import { GoalsViewModel } from './goals-view-model';
import { NetworthRepository } from '../../../../../../repository/networth/networth.repository';
import { GoalRepository } from '../../../../../../repository/goal/goal.repository';
import { UserRepository } from '../../../../../../repository/user/user.repository';
import * as cleanDeep from 'clean-deep';
import { Client } from '../../../../../../model/client';
import { MaterialDialogPaddingRemover } from '../../../../../../core/material-dialog-padding-remover';
import { DatePipe } from '@angular/common';


@Injectable()
export class GoalFundingViewModel {

    private model;
    public assets: Array<Asset> = [];
    public goals: Array<Goal> = [];
    clientId;
    assetViewModel: Array<AssetsViewModel> = [];
    goalsViewModel: Array<GoalsViewModel> = [];
    currencyFormatter = new CurrencyFormatter();
    draggedAssetViewModel: AssetsViewModel;
    droppedToGoalViewModel: GoalsViewModel;
    clientDetail: Client;

    constructor(
        private networthRepo: NetworthRepository,
        private goalRepo: GoalRepository,
        private userRepo: UserRepository
    ) {
    }

    async getGoalFundingInfos() {

        try {
            this.goals = [];
            const goalResponse = await this.goalRepo.getAllGoals(this.clientId);
            this.goals = goalResponse;

            this.assets = [];
            const response = await this.networthRepo.getAllAssets(this.clientId);
            this.assets = response;

            const clientResponse = await this.userRepo.getClient(this.clientId);
            this.clientDetail = clientResponse;

            await this.configureGoalFunding();
            await this.configureAssets();
        } catch (error) {
            throw error
        }
    }

    async configureAssets() {
        this.assetViewModel = [];
        for (const asset of this.assets) {
            const assetViewModel = new AssetsViewModel(this.currencyFormatter, asset, this.goalsViewModel);
            this.assetViewModel.push(assetViewModel);
        }
    }


    async configureGoalFunding() {
        this.goalsViewModel = [];
        for (const goal of this.goals) {
            const goalViewModel = new GoalsViewModel(this.currencyFormatter, goal, this.assets, this.clientDetail);
            this.goalsViewModel.push(goalViewModel);
        }
    }

    async mapAssetToGoal() {
        const assetIds = this.droppedToGoalViewModel.mappedAssetIds;
        assetIds.push({
            '_id': this.draggedAssetViewModel.model._id
        });
        try {
            const mapGoals = await this.goalRepo.mapAssetsToGoal(this.clientId, this.droppedToGoalViewModel.getGoalId(), assetIds);
            const index = this.goalsViewModel.indexOf(this.droppedToGoalViewModel);
            if (index > -1) {
                this.draggedAssetViewModel.isMappedToGoal = true;
                const goalViewModel = new GoalsViewModel(this.currencyFormatter, mapGoals, this.assets, this.clientDetail);
                this.goalsViewModel[index] = goalViewModel;
            }
        } catch (error) {
            throw error;
        }
    }

    async saveGoalMap() {
        const finalGoals = [];
        for (const goalViewModel of this.goalsViewModel) {
            finalGoals.push({
                '_id': goalViewModel.model._id,
                'corpusRequired': goalViewModel.model.corpusRequired
            })
        }
        try {
            const response = await this.goalRepo.saveMappedAssets(this.clientId, finalGoals);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteMappedAsset (goalDetail, mappedAsset) {
        const assetIds = goalDetail.mappedAssetIds.filter((assetId) => assetId._id != mappedAsset._id);

        try {
            const mapGoals = await this.goalRepo.mapAssetsToGoal(this.clientId, goalDetail.getGoalId(), assetIds);
            const index = this.goalsViewModel.indexOf(goalDetail);
            if (index > -1) {
                const assetViewModel = this.assetViewModel.find((assetVM) => assetVM.model._id == mappedAsset._id);
                if (assetViewModel) {
                    assetViewModel.isMappedToGoal = false;
                }
                const goalViewModel = new GoalsViewModel(this.currencyFormatter, mapGoals, this.assets, this.clientDetail);
                this.goalsViewModel[index] = goalViewModel;
            }
        } catch (error) {
            throw error;
        }
    }

    getGoalImage(goal) {
        for (const goalType of GoalTypeUtils.getAllGoalType()) {
            if (goal.model.kind == goalType.key) {
                return goalType.image
            }
        }
    }

    displayAssetTypeName(kind) {
        // return AssetTypeUtils.getAssetTypeText(kind)
    }

    didRemovePadding() {
        const padding = new MaterialDialogPaddingRemover();
        return padding.didRemovePaddingForMaterialDialog();
    }


    convertDateFormat(date) {
        if (date != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(date, 'dd/MM/yyyy');
        }
    }

    canMapAssetToGoalDateCheck () {
        if (this.draggedAssetViewModel.maturityDate) {
            if (this.droppedToGoalViewModel.startDate > this.draggedAssetViewModel.maturityDate) {
                return true;
            } else {
                return false;
            }
        }

        return true;
    }

    canMapAssetToGoalPercentCheck() {
        if (this.droppedToGoalViewModel.pecentageFunded > 100) {
            return false;
        }

        return true;
    }

}
