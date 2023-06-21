import { Asset } from '../model/asset/asset'
import { Goal } from '../model/goal/goal';
import { AllocationViewModel } from './allocation-view-model';
import * as DateDiff from 'date-diff';


export class GoalCostViewModel {

    model: Goal;
    corpusRequiredAtStartOfGoal = 0;
    totalProjectedAmount = 0;
    percentageGoalFunded = 0;

    constructor(model, assets, userDetails, financeService) {
        this.model = model;
        this.calculateCorpusRequiredOfGoal(userDetails, financeService);
        this.calculateTotalProjectedAmount(userDetails, assets, financeService);
        if (this.corpusRequiredAtStartOfGoal && this.totalProjectedAmount > 0) {
            this.percentageGoalFunded = Math.round((this.totalProjectedAmount/this.corpusRequiredAtStartOfGoal)*100);
        }
    }

    calculateCorpusRequiredOfGoal(userDetails, financeService) {

        let goalStartDate = this.model.goalTimeLine.startDate.projectedStartDate(userDetails)
        var diff = new DateDiff(new Date(), goalStartDate);
        let months = Math.abs(Math.round(diff.months()))
        this.corpusRequiredAtStartOfGoal = financeService.FV(this.model.inflationRate, months, 0, this.model.currentValuation, 1);
    
    }

    calculateTotalProjectedAmount(userDetails, assets, financeService) {

        const goalStartDate = this.model.goalTimeLine.startDate.projectedStartDate(userDetails)

        let totalProjectedAmount = 0;
        if (this.model && this.model.allocations && this.model.allocations.length > 0) {
            for (let allocatedAsset of this.model.allocations) {

                //use find
                let asset = assets.find(asset => asset._id == allocatedAsset.assetId)
                if (asset.rateOfReturns && asset.rateOfReturns.length > 0) {
                    let i = 0;
                    let nextDate;
                    let allocatedAmount = 0;
                    allocatedAmount = +allocatedAmount + +allocatedAsset.amount
                    if (asset.rateOfReturns[i].fromDate < goalStartDate) {
                        while (i < asset.rateOfReturns.length) {
                            if (asset.rateOfReturns[i+1]) {
                                nextDate = asset.rateOfReturns[i+1].fromDate;
                            } else {
                                nextDate = goalStartDate;
                            }
                            var diff = new DateDiff(asset.rateOfReturns[i].fromDate, nextDate);
                            let nper = Math.abs(Math.round(diff.months()));
                            allocatedAmount = financeService.FV(asset.rateOfReturns[i].rate, nper, 0, allocatedAmount, 1);
                            i++;
                        }
                        totalProjectedAmount = +totalProjectedAmount + +allocatedAmount;
                    }
                } else {
                    totalProjectedAmount += +allocatedAsset.amount;
                }
            }
            this.totalProjectedAmount = totalProjectedAmount;
        }
    }
}
