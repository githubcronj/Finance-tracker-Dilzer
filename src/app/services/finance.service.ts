import { Injectable } from '@angular/core';
import * as Finance from 'financial'
import * as percentage from 'percentage-calc';

@Injectable()
export class FinanceService {

    constructor() {

    }

    PMT(rateOfInterest, tenure, loanAmount) {
        return Finance.PMT((rateOfInterest / 100) / 12, tenure * 12, -loanAmount, 0, 0);
    }

    /*** Formula To calculate cumulative interest paid on a loan(CUMIPMT) ***/
    CUMIPMT(r, nper, pv, startPeriod, endPeriod) {

        if (r == null || nper == null || pv == null || startPeriod == null || endPeriod == null) {
            return null
        }
        return Math.round(Finance.CUMIPMT((r / 100) / 12, nper, pv, startPeriod, endPeriod, 0));
    }


    /*** Formula To calculate number of periods(NPER) ***/
    NPER(r, pmt, pv) {
        return Math.round(Finance.NPER((r / 100) / 12, -pmt, pv, 0, 0));
    }


    /*** Formula To calculate future value(FV) ***/
    FV(r, nper, pmt, pv, pd) {
        return Math.round(Finance.FV(r / 100, nper / 12, pmt, -pv, pd))
    }


    calculateAmountFromPercentage(percent, totalAmount) {

        if (percent == null || totalAmount == null) {
            return null
        }

        return Math.round(percentage.of(percent, totalAmount))

    }


    calculatePercentageFromAmount(amount, totalAmount) {

        if (amount == null || totalAmount == null) {
            return null
        }

        return Math.round(percentage.from(amount, totalAmount))

    }


}