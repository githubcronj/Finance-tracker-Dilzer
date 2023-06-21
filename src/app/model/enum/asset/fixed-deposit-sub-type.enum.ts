
export enum FixedDepositAssetSubType {
    TermDeposit = <any>'TermDeposit',
    CorporateFD = <any>'CorporateFD',
    FlexiFD = <any>'FlexiFD',
    RecurringDeposit = <any>'RecurringDeposit',
    Other = <any>'Other'
}

export class FixedDepositAssetSubTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case FixedDepositAssetSubType.TermDeposit: return 'Term Deposit';
            case FixedDepositAssetSubType.CorporateFD: return 'Corporate FD';
            case FixedDepositAssetSubType.FlexiFD: return 'Flexi FD';
            case FixedDepositAssetSubType.RecurringDeposit: return 'Recurring Deposit';
            case FixedDepositAssetSubType.Other: return 'Other';
        }
    }


    public static getAllAssetSubType() {
        const options = [
            {
                key: FixedDepositAssetSubType.TermDeposit,
                value: this.getAssetSubTypeText(FixedDepositAssetSubType.TermDeposit)
            },
            {
                key: FixedDepositAssetSubType.CorporateFD,
                value: this.getAssetSubTypeText(FixedDepositAssetSubType.CorporateFD)
            },
            {
                key: FixedDepositAssetSubType.FlexiFD,
                value: this.getAssetSubTypeText(FixedDepositAssetSubType.FlexiFD)
            },
            {
                key: FixedDepositAssetSubType.RecurringDeposit,
                value: this.getAssetSubTypeText(FixedDepositAssetSubType.RecurringDeposit)
            },
            {
                key: FixedDepositAssetSubType.Other,
                value: this.getAssetSubTypeText(FixedDepositAssetSubType.Other)
            }
        ];
        return options;
    }
}
