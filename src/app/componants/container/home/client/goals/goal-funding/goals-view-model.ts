import { Asset } from '../../../../../../model/asset/asset'
import { Goal } from '../../../../../../model/goal/goal';
import { AllocationViewModel } from '../../../../../../view-model/allocation-view-model';
import { DatePipe } from '@angular/common';


export class GoalsViewModel {

    model: Goal;
    name: String;
    currentValuationDisplayString = 0;
    corpusRequired = 0;
    corpusRequiredDisplayString = 0;
    fundedAmount = 0;
    fundedAmountDisplayString = 0;
    pecentageFunded = 0;
    allocatedAssetDetails = [];
    currencyFormatter: any;
    mappedAssetIds = [];
    startDate: Date;
    startDateString: String;
    endDate: Date;
    endDateString: String;
    goalTimelineDisplayString: String;
    goalCorpusBreakup = [];

    constructor(currencyFormatter, model, assets, clientDetail) {
        this.currencyFormatter = currencyFormatter;
        this.model = model;
        this.name = this.model.name;
        if (this.model.corpusRequired.occurrences && this.model.corpusRequired.occurrences.length > 0) {
            this.goalCorpusBreakup = this.model.corpusRequired.occurrences;
        }
        this.currentValuationDisplayString = this.displayCurrency(this.model.currentValuation);
        if (model && model.corpusRequired) {
            this.fundedAmount = (model.corpusRequired.fundedAmount) ? model.corpusRequired.fundedAmount : 0;
            this.fundedAmountDisplayString = (model.corpusRequired.fundedAmount) ? this.displayCurrency(model.corpusRequired.fundedAmount) : 0;
            this.pecentageFunded = model.corpusRequired.pecentageFunded ? model.corpusRequired.pecentageFunded.toFixed(2) : 0;

            /********** Asset Allocated Details *************/
            if (model.corpusRequired.assets) {
                model.corpusRequired.assets.map((mappedAsset) => {
                    this.mappedAssetIds.push({'_id': mappedAsset._id});
                    const assetObj = assets.find((asset) => asset._id == mappedAsset._id);
                    if (assetObj) {
                        const assetDisplayLogic = {
                            '_id': mappedAsset._id,
                            'displayString': assetObj.name,
                            'amount': mappedAsset.breakup[mappedAsset.breakup.length - 1].closingBalanace,
                            'amountFormat': this.displayCurrency(mappedAsset.breakup[mappedAsset.breakup.length - 1].closingBalanace),
                            'breakup': mappedAsset.breakup
                        }
                        this.allocatedAssetDetails.push(assetDisplayLogic);
                    }
                });
            }
        }
        if (model.corpusRequired && model.corpusRequired.amount) {
            this.corpusRequired = model.corpusRequired.amount;
            this.corpusRequiredDisplayString = this.displayCurrency(model.corpusRequired.amount);
        }
        if (this.model.goalTimeLine && this.model.goalTimeLine.startDate) {
            this.startDate = this.model.goalTimeLine.startDate.projectedStartDate(clientDetail);
            this.startDateString = this.convertDateFormat(this.startDate);
            this.goalTimelineDisplayString = 'At ' + this.startDateString;
        }
        if (this.model.goalTimeLine && this.model.goalTimeLine.endDate) {
            this.endDate = this.model.goalTimeLine.endDate.projectedStartDate(clientDetail);
            this.endDateString = this.convertDateFormat(this.endDate);
            this.goalTimelineDisplayString = 'From ' + this.startDateString + ' to ' + this.endDateString + ' repeats every ' + this.model.goalTimeLine.frequency + ' years';
        }
    }

    getGoalId() {
        return this.model._id;
    }

    displayCurrency(amount) {
        return this.currencyFormatter.currencyFormatter(amount);
    }

    convertDateFormat(date) {
        if (date != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(date, 'dd/MM/yyyy');
        }
    }
}
