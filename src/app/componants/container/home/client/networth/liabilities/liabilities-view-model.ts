import { Injectable } from '@angular/core';
import { NetworthRepository } from '../../../../../../repository/networth/networth.repository'
import { LiabilitiesListViewModel } from './liabilities-list-view-model';
import { CurrencyFormatter } from '../../../../../../core/currency-formatter'
import { GraphDataSet } from '../../../../../../model/graph-data-set';

@Injectable()
export class LiabilitiesViewModel {

    private liabilities = [];
    public clientId;
    public liabilitiesItems;
    public totalValuationDisplayString: String;
    private currencyFormatter = new CurrencyFormatter();
    public liabilitySelectedForDelete;
    public searchTerm;
    public tempLiabilityList;
    public kind;
    public clientDetails;
    public kindDisplayString;


    constructor(private networthRepository: NetworthRepository) {

    }


    async getLiabilities(kind) {

        try {
            this.liabilitiesItems = new Array<LiabilitiesListViewModel>();
            this.liabilities = [];
            let response = await this.networthRepository.getLiabilities(this.clientId, kind);
            this.liabilities = response
            this.getTotalLiabilityOutstandingAmount()

        } catch (error) {
            throw error;
        }
    }

    getTotalLiabilityOutstandingAmount() {

        let totalCurrentValuation = 0;
        this.liabilitiesItems = []
        for (let liability of this.liabilities) {
            this.liabilitiesItems.push(new LiabilitiesListViewModel(this.currencyFormatter, liability, this.clientDetails.ownerOfResourceList()))
            totalCurrentValuation += liability.currentStage.outStandingAmount;
        }
        if (this.liabilitiesItems && this.liabilitiesItems[0]) {
            this.kindDisplayString = this.liabilitiesItems[0].liabilityTypeDisplayString;
        }
        this.totalValuationDisplayString = '₹' + this.currencyFormatter.currencyFormatter(totalCurrentValuation);
    } catch(error) {
        throw error;
    }


    async deleteLiability(id) {
        try {
            if (confirm('Are you sure you want to delete this Liability?') == true) {
                let response = await this.networthRepository.deleteLiability(this.clientId, id);
                await this.getLiabilities(this.kind);
                this.liabilitySelectedForDelete = 0
                return true;
            }
        } catch (error) {
            throw error;
        }

    }

    async deleteSelectedLiabilities() {
        let selectedLiabilitiesArray = this.liabilitiesItems.filter(liability => { return liability.isSelectedForDelete });
        selectedLiabilitiesArray = selectedLiabilitiesArray.map(liability => { ; return liability.liability._id })
        try {
            if (selectedLiabilitiesArray.length > 0) {
                if (confirm('Are you sure you want to delete this liability?') == true) {
                    let response = await this.networthRepository.deleteSelectedLiabilities(this.clientId, selectedLiabilitiesArray);
                    await this.getLiabilities(this.kind);
                    this.liabilitySelectedForDelete = 0
                }
            }
        } catch (error) {
            throw error;
        }

    }
    countSelected() {
        this.liabilitySelectedForDelete = this.liabilitiesItems.filter(function (x) { return x.isSelectedForDelete; }).length;
    }

    selectDeselectAll(checked) {
        const count = 0;
        if (checked) {
            this.liabilitiesItems.map((x) => {
                x.isSelectedForDelete = true;
                return x
            });
            this.countSelected();
        } else {
            this.liabilitiesItems.map((x) => {
                x.isSelectedForDelete = false;
                return x
            });
            this.countSelected();
        }
    }

    searchLiabilityList() {

        this.getTotalLiabilityOutstandingAmount()
        const key = this.searchTerm.toLowerCase();
        this.tempLiabilityList = [];
        this.tempLiabilityList = this.liabilitiesItems
        this.liabilitiesItems = this.tempLiabilityList.filter((liability) => {

            if (liability.currentOutstandingAmount == parseFloat(key) || liability.liability.rateOfInterest == parseFloat(key) || liability.emiPayable == parseFloat(key)) {
                return true
            }
            return this.matchString(liability.liability.name, key) || this.matchString(liability.liabilityTypeDisplayString, key) || this.matchString(liability.liability.kind, key) || this.matchString(liability.ownerName, key) || this.matchString(liability.liability.owner, key) || this.matchString(liability.outstandingLoanAmountDisplayString, key) || this.matchString(liability.rateOfInterestDisplayString, key) || this.matchString(liability.emiPayableDisplayString, key) || this.matchString(liability.createdDateDisplayString, key);
        });
    }


    matchString(keyword, key) {

        if (keyword == null) {
            return false
        } else {
            return new RegExp(key, 'gi').test(keyword.trim().toLowerCase())
        }
    }

}