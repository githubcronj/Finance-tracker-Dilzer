
export enum CashInHandAssetSubType {
    SavingsBank = <any>'SavingsBank',
    CurrentAccount = <any>'CurrentAccount',
    SalaryAccount = <any>'SalaryAccount',
    OverseasAccount = <any>'OverseasAccount',
    NREOrNROAccount = <any>'NREOrNROAccount',
    Other = <any>'Other'
}


export class CashInHandAssetSubTypeUtils {
    public static getAssetSubTypeText(assests) {
        switch (assests) {
            case CashInHandAssetSubType.SavingsBank: return 'Savings Bank';
            case CashInHandAssetSubType.CurrentAccount: return 'Current Account';
            case CashInHandAssetSubType.SalaryAccount: return 'Salary Account';
            case CashInHandAssetSubType.OverseasAccount: return 'Overseas Account';
            case CashInHandAssetSubType.NREOrNROAccount: return 'NRE or NRO Account';
            case CashInHandAssetSubType.Other: return 'Other';
        }
    }

    public static getAllAssetSubType() {
        const options = [
            {
                key: CashInHandAssetSubType.SavingsBank,
                value: this.getAssetSubTypeText(CashInHandAssetSubType.SavingsBank)
            },
            {
                key: CashInHandAssetSubType.CurrentAccount,
                value: this.getAssetSubTypeText(CashInHandAssetSubType.CurrentAccount)
            },
            {
                key: CashInHandAssetSubType.SalaryAccount,
                value: this.getAssetSubTypeText(CashInHandAssetSubType.SalaryAccount)
            },
            {
                key: CashInHandAssetSubType.OverseasAccount,
                value: this.getAssetSubTypeText(CashInHandAssetSubType.OverseasAccount)
            },
            {
                key: CashInHandAssetSubType.NREOrNROAccount,
                value: this.getAssetSubTypeText(CashInHandAssetSubType.NREOrNROAccount)
            },
            {
                key: CashInHandAssetSubType.Other,
                value: this.getAssetSubTypeText(CashInHandAssetSubType.Other)
            }
        ];
        return options;
    }
}
