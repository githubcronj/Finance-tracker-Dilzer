export class CommittedSavingTypeUtils {
    public static getCommittedSavingTypeText(type, isAsset) {
        if (isAsset) {
            switch (type) {
                case CommittedSavingType.LupsumDeposit: return 'Lumpsum Deposit';
                case CommittedSavingType.RegularSaving: return 'Regular Savings';
            }
        } else {
            switch (type) {
                case CommittedSavingType.LupsumDeposit: return 'Lumpsum Repayment';
                case CommittedSavingType.RegularSaving: return 'Regular Repayment';
            }
        }
    }

    public static getCommittedSavingTypeTextForDb(type) {
        switch (type) {
            case CommittedSavingType.LupsumDeposit: return 'Lumpsum';
            case CommittedSavingType.RegularSaving: return 'Regular';
        }
    }


    public static getCommittedSavingType(isAsset) {
        const options = [
            {
                key: CommittedSavingType.LupsumDeposit,
                value: this.getCommittedSavingTypeText(CommittedSavingType.LupsumDeposit, isAsset)
            },
            {
                key: CommittedSavingType.RegularSaving,
                value: this.getCommittedSavingTypeText(CommittedSavingType.RegularSaving, isAsset)
            }
        ];
        return options;
    }
}


export enum CommittedSavingType {
    LupsumDeposit = <any>'Lumpsum',
    RegularSaving = <any>'Regular'
}



